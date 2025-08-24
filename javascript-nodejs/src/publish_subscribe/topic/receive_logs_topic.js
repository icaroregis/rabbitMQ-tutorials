#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>');
  process.exit(1);
}

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_logs';

    channel.assertExchange(exchange, 'topic', {
      durable: false,
    });

    channel.assertQueue(
      '',
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        args.forEach(function (key) {
          channel.bindQueue(q.queue, exchange, key);
        });

        channel.consume(
          q.queue,
          function (msg) {
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
});

// Para receber todos os logs:

// ./receive_logs_topic.js "#"

// Para receber todos os registros da instalação kern:

// ./receive_logs_topic.js "kern.*"

// Ou se você quiser ouvir apenas sobre criticallogs:

// ./receive_logs_topic.js "*.critical"

// Você pode criar várias ligações:

// ./receive_logs_topic.js "kern.*" "*.critical"

// E para emitir um log com uma chave de roteamento kern.criticaldigite:

// ./emit_log_topic.js "kern.critical" "A critical kernel error"

// Divirta-se brincando com estes programas. Observe que o código não faz nenhuma suposição sobre as chaves de roteamento ou vinculação; você pode querer brincar com mais de dois parâmetros de chave de roteamento.
