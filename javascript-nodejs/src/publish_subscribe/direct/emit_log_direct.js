#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || 'Hello World!';
    var severity = args.length > 0 ? args[0] : 'info';

    channel.assertExchange(exchange, 'direct', {
      durable: false,
    });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});

// Se você quiser salvar apenas mensagens de log de 'aviso' e 'erro' (e não de 'informações') em um arquivo, basta abrir um console e digitar:
// ./receive_logs_direct.js warning error > logs_from_rabbit.log

// Se você quiser ver todas as mensagens de log na tela, abra um novo terminal e faça:
// ./receive_logs_direct.js info warning error # => [*] Waiting for logs. To exit press CTRL+C

// E, por exemplo, para emitir uma mensagem de log de erro basta digitar:
// ./emit_log_direct.js error "Run. Run. Or it will explode." # => [x] Sent 'error':'Run. Run. Or it will explode.'
