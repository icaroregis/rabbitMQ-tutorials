#!/usr/bin/env node
// Exchange (troca) => "roteador" de mensagens

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false,
    });

    channel.assertQueue(
      '',
      // '' = "Me dê uma fila exclusiva, com nome aleatório, só para mim".
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);
        channel.bindQueue(q.queue, exchange, '');
        // '' = "Não preciso de chave de roteamento, pois o exchange é do tipo fanout".

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(' [x] %s', msg.content.toString());
            }
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
});

// channel.assertQueue('', {exclusive: true}, function(error2, q) {});
// 1. Por que o primeiro argumento de channel.assertQueue('', { exclusive: true }, ...) é uma string vazia?
// Quando você passa uma string vazia ('') como nome da fila, o RabbitMQ cria uma fila com um nome gerado automaticamente (único).
// Isso é útil quando você quer uma fila temporária, exclusiva para a conexão atual, e não precisa de um nome fixo.
// O nome real da fila é retornado no callback, no objeto q.queue.
// Resumo:
// '' = "Me dê uma fila exclusiva, com nome aleatório, só para mim".

// channel.bindQueue(q.queue, exchange, '');
// 2. O que significa o terceiro argumento vazio em channel.bindQueue(q.queue, exchange, '')?
// O terceiro argumento é o "routing key" (chave de roteamento).
// No tipo de exchange fanout, a chave de roteamento é ignorada, pois o exchange envia a mensagem para todas as filas ligadas a ele, independentemente da chave.
// Por padrão, usa-se '' (string vazia) para indicar que não há chave de roteamento relevante.
// Resumo:
// '' = "Não preciso de chave de roteamento, pois o exchange é do tipo fanout".
