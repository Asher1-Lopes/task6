using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace updateinto
{


    public static class Myclass1
    {
        private static readonly string _connectionString = "Server=localhost;Database=sql_workbench;User=root;Password=root;";


        public static async Task updateloaderAsync( int c)
        {


            Console.WriteLine(c);


        }



    }
}
