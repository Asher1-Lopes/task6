
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Diagnostics;
using insertinto;
using updateinto;


public class Program
{
    private static readonly string _queueName = "hello_queue1";
    private int BatchSize = 0;
    private int count = 1;
    private int c = 0;
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
        var stopWatch = new Stopwatch();
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);


            try
            {

                // Deserialize the message to TodoMessage object
                var todoMessage = JsonSerializer.Deserialize<TodoMessage>(message);

                stopWatch.Start();

                if (todoMessage != null)
                {
                    var filename = todoMessage.Filename;
                    var file_id = todoMessage.File_id;
                    int no_ofchunks = todoMessage.No_ofchunks;

                    var todoItems = todoMessage.Chunk;

                    // Console.WriteLine(todoItems.Count());
                    BatchSize = todoItems.Count();
                    // Console.WriteLine( no_ofchunks);

                    int percent = 100 / no_ofchunks;
                    c = percent;
                    _todoItemsBatch.AddRange(todoItems);

                    if (_todoItemsBatch.Count >= BatchSize)
                    {



                        await Myclass.InsertTodoItemsBatchAsync(_todoItemsBatch, filename, file_id);
                        _todoItemsBatch.Clear();
                        Console.WriteLine("Received chunk with " + todoItems.Count().ToString() + " items " + count);

                        Console.WriteLine("loaded" + c + "%");
                        //   await Myclass1.updateloaderAsync(c);
                        c += percent;
                        count++;

                        // update func will come 
                      
                        // if (c > 100)
                        // {
                        //     c = 10;
                        // }
                    }

                }

            }

            catch (JsonException ex)
            {
                Console.WriteLine($"Error deserializing message: {ex.Message}");
            }


            stopWatch.Stop();
            Console.WriteLine(stopWatch.Elapsed);

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
    public class TodoMessage
    {
        public string Filename { get; set; } = string.Empty;
        public int File_id { get; set; }
        public int No_ofchunks { get; set; }
        public IEnumerable<TodoItem> Chunk { get; set; }
    }

}
