
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using TodoApi.Models; // Ensure this using directive is present



public class RabbitMqService
{
    private readonly string _hostname = "localhost";
    private readonly string _queueName = "hello_queue1";
    int count = 1;
    private IConnection _connection;
    private IModel _channel;

    public RabbitMqService()
    {
        // Initialize RabbitMQ connection and channel
        var factory = new ConnectionFactory() { HostName = _hostname };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // Declare the queue
        _channel.QueueDeclare(queue: _queueName,
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);
    }
    // public void SendMessage(todoitem)
    // {
    //     var msg = JsonSerializer.Serialize(todoitem);
    //     Console.WriteLine(msg);
    //     var body = Encoding.UTF8.GetBytes(msg);
    //     var properties = _channel.CreateBasicProperties();
    //     properties.Persistent = true;

    //     _channel.BasicPublish(
    //         exchange: "",
    //         routingKey: _queueName,
    //         basicProperties: properties,
    //         body: body);


    // }
    public void SendChunk(IEnumerable<TodoItem> chunk)
    {

        var message = JsonSerializer.Serialize(chunk);
        //  + message
        Console.WriteLine("Sending chunk: " + count );
        count++;

        var body = Encoding.UTF8.GetBytes(message);

        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true;

        _channel.BasicPublish(exchange: "",
                             routingKey: _queueName,
                             basicProperties: properties,
                             body: body);
    }

    public void Dispose()
    {

        _channel?.Close();
        _channel?.Dispose();
        _connection?.Close();
        _connection?.Dispose();

    }
}
