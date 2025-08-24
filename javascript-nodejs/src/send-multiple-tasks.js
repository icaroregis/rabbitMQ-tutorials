#!/usr/bin/env node
// Script para enviar múltiplas tarefas para testar distribuição
const amqp = require('amqplib/callback_api');

function sendMultipleTasks() {
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      const queue = 'task_queue';

      channel.assertQueue(queue, {
        durable: true, // Fila persistente
      });

      // Lista de tarefas para enviar
      const tasks = [
        'Tarefa rápida.',
        'Tarefa média..',
        'Tarefa pesada...',
        'Tarefa simples.',
        'Tarefa complexa.....',
        'Tarefa normal..',
        'Tarefa final.',
      ];

      let taskIndex = 0;

      // Enviar uma tarefa a cada segundo
      const interval = setInterval(() => {
        if (taskIndex < tasks.length) {
          const task = tasks[taskIndex];

          channel.sendToQueue(queue, Buffer.from(task), {
            persistent: true, // Mensagem persistente
          });

          console.log(`📤 Enviou tarefa ${taskIndex + 1}: "${task}"`);
          taskIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            connection.close();
            process.exit(0);
          }, 500);
        }
      }, 1000);
    });
  });
}

sendMultipleTasks();
