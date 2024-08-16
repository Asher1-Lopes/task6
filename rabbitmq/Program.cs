
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using insertinto;

public class Program
{
    private static readonly string _queueName = "hello_queue1";
    private const int BatchSize = 10000;  // Batch size
    private int count = 1;
    private IConnection _rabbitConnection;
    private IModel _channel;
    // private MySqlConnection _dbConnection;
    private static List<insertinto.TodoItem> _todoItemsBatch = new List<insertinto.TodoItem>();

    public Program()
    {
        // Initialize RabbitMQ connection and channel
        var factory = new ConnectionFactory() { HostName = "localhost" };
        _rabbitConnection = factory.CreateConnection();
        _channel = _rabbitConnection.CreateModel();

        // Declare the queue
        _channel.QueueDeclare(queue: _queueName,
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);


    }

    public async Task StartAsync()
    {
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

        
            try
            {
                var todoItems = JsonSerializer.Deserialize<List<insertinto.TodoItem>>(message); 
                if (todoItems != null)
                {
                    Console.WriteLine("Received chunk with " + todoItems.Count + " items " + count);
                    count++;
                    _todoItemsBatch.AddRange(todoItems);

                    if (_todoItemsBatch.Count >= BatchSize)
                    {

                        await Myclass.InsertTodoItemsBatchAsync(_todoItemsBatch);
                        _todoItemsBatch.Clear();
                    }
                }
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error deserializing message: {ex.Message}");
            }

            // Ack manual
            _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
        };

        _channel.BasicConsume(queue: _queueName,
                             autoAck: false,
                             consumer: consumer);

        Console.WriteLine("Waiting for messages. Press [enter] to exit.");
        await Task.Run(() => Console.ReadLine());
    }



    public void Dispose()
    {
        _channel?.Close();
        _channel?.Dispose();
        _rabbitConnection?.Close();
        _rabbitConnection?.Dispose();
    }

    public static async Task Main(string[] args)
    {
        var program = new Program();
        await program.StartAsync();
    }
}
