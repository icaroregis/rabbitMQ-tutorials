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
      durable: true, // Fila persistente
    });

    channel.prefetch(1);
    //  Isso informa ao RabbitMQ para não enviar mais de uma mensagem a um trabalhador por vez. Ou, em outras palavras, não enviar uma nova mensagem a um trabalhador até que ele tenha processado e confirmado a anterior. Em vez disso, ele a enviará para o próximo trabalhador que ainda não estiver ocupado.

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    channel.consume(
      queue,
      function (msg) {
        var secs = msg.content.toString().split('.').length - 1;

        console.log(' [x] Received %s', msg.content.toString());
        setTimeout(function () {
          console.log(' [x] Done');
          channel.ack(msg); // “Processamento concluído, pode remover a mensagem da fila”
        }, secs * 1000);
      },
      {
        noAck: false,
      },
    );
  });
});

// Como funciona o fluxo do ack no RabbitMQ
// Mensagem é entregue ao worker

// O RabbitMQ envia a mensagem para um worker disponível.
// A mensagem fica marcada como “não confirmada” (unacknowledged).
// Worker processa a mensagem

// O worker executa o código (no seu caso, simula um tempo de processamento com setTimeout).
// Worker envia o ack

// Quando o processamento termina, o worker executa channel.ack(msg).
// Isso avisa o RabbitMQ: “Processamento concluído, pode remover a mensagem da fila”.
// Se o worker MORRER antes do ack

// Se o worker cair, perder conexão, travar ou for fechado antes de enviar o ack:
// O RabbitMQ percebe que a conexão foi perdida.
// A mensagem NÃO é removida da fila.
// O RabbitMQ reencaminha essa mensagem para outro worker disponível (ou espera até que algum worker fique online).
// Se não houver nenhum worker online

// A mensagem fica aguardando na fila, marcada como “não confirmada”.
// Assim que um worker conectar, o RabbitMQ entrega a mensagem para ele.
// Resumo visual
// Por que isso é importante?
// Garantia de entrega: Nenhuma mensagem é perdida se um worker falhar.
// Resiliência: O RabbitMQ só remove a mensagem quando tem certeza que foi processada.
// Balanceamento automático: Se um worker está offline, outro pode assumir.
// Dica
// Se você usar { noAck: true }, o RabbitMQ considera a mensagem processada assim que entrega ao worker (não recomendado para tarefas críticas).
// Resumindo:
// Sim, o RabbitMQ só remove a mensagem da fila após receber o ack. Se o worker morrer antes disso, a mensagem será entregue a outro worker automaticamente, garantindo que nenhuma tarefa se perca!
