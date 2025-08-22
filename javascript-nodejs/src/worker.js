#!/usr/bin/env node
// O que são Workers no RabbitMQ?
// Workers são consumidores/trabalhadores que processam tarefas de uma fila. No padrão "Work Queue", múltiplos workers podem consumir da mesma fila, criando um sistema de distribuição de trabalho.

// Distribuição Automática de Mensagens
// A distribuição entre workers É AUTOMÁTICA no RabbitMQ usando o algoritmo Round Robin por padrão:

// Mensagem 1 → Worker 1
// Mensagem 2 → Worker 2
// Mensagem 3 → Worker 1
// Mensagem 4 → Worker 2

var amqp = require('amqplib/callback_api');

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
      durable: true,
    });
    channel.prefetch(1);
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    channel.consume(
      queue,
      function (msg) {
        var secs = msg.content.toString().split('.').length - 1;

        console.log(' [x] Received %s', msg.content.toString());
        setTimeout(function () {
          console.log(' [x] Done');
          channel.ack(msg);
        }, secs * 1000);
      },
      {
        noAck: false,
      },
    );
  });
});
