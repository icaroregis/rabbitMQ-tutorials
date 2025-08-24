#!/usr/bin/env node
// Script para testar múltiplos workers
var amqp = require('amqplib/callback_api');

// Função para criar um worker com ID específico
function createWorker(workerId) {
  amqp.connect('amqp://localhost', function (error, connection) {
    if (error) {
      throw error;
    }

    connection.createChannel(function (error, channel) {
      if (error) {
        throw error;
      }

      var queue = 'task_queue';

      channel.assertQueue(queue, {
        durable: true, // fila persistente
      });

      // Configuração importante: prefetch(1) garante distribuição justa
      channel.prefetch(1);

      console.log(`🔴 Worker ${workerId} - Aguardando mensagens...`);

      channel.consume(
        queue,
        function (msg) {
          var task = msg.content.toString();
          var processingTime = task.split('.').length - 1; // Simula tempo baseado em pontos

          console.log(`📥 Worker ${workerId} - Recebeu: "${task}"`);

          // Simula processamento
          setTimeout(function () {
            console.log(`✅ Worker ${workerId} - Concluiu: "${task}"`);
            channel.ack(msg); // Confirma processamento
          }, processingTime * 1000);
        },
        {
          noAck: false, // Requer acknowledgment
        },
      );
    });
  });
}

// Obtém o ID do worker dos argumentos da linha de comando
const workerId = process.argv[2] || '1';
createWorker(workerId);
