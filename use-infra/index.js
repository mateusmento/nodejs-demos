const pg = require("pg");
const mongo = require("mongodb");
const redis = require("redis");

async function usePostgres() {
  const client = new pg.Client({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
  });
  await client.connect()
  const res = await client.query('DROP TABLE IF EXISTS foo; CREATE TABLE foo (); DROP TABLE foo;');
  await client.end();
}

usePostgres();

(async () => {
  const client = new mongo.MongoClient("mongodb://mongo:mongo@localhost:27017/foodb?authSource=admin");
  await client.connect();
  const db = client.db("foodb");
  const foos = db.collection("foos");
  await foos.find({}).toArray();
  await foos.insertOne({hello: "world"});
  await client.close();
})();

(async () => {
  const client = redis.createClient();
  await client.connect();
  await client.set("key", "value");
  await client.get("key");
  await client.disconnect();
})();

const elastic = require("@elastic/elasticsearch");

(async () => {
  const client = new elastic.Client({ node: 'http://localhost:9200' });

  await client.index({
    index: 'game-of-thrones',
    body: {
      character: 'Ned Stark',
      quote: 'The winter is coming.'
    }
  })

  await client.index({
    index: 'game-of-thrones',
    body: {
      character: 'Daenerys winter',
      quote: 'I am the blood of the dragon.'
    }
  })

  await client.indices.refresh({ index: 'game-of-thrones' })

  const { body } = await client.search({
    index: 'game-of-thrones',
    body: {
      query: {
        match: { quote: 'winter' }
      }
    }
  })

  //console.log(body.hits.hits)
})();

const neo4j = require("neo4j-driver");

(async () => {
  const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "rootneo4j"));
  const session = driver.session();
  session
    .run('MERGE (alice:Person {name : $nameParam}) RETURN alice.name AS name', {
      nameParam: 'Alice'
    })
    .subscribe({
      onKeys: keys => {
        console.log(keys)
      },
      onNext: record => {
        console.log(record.get('name'))
      },
      onCompleted: async () => {
        await session.close();
        await driver.close();
      },
    });
})();

const amqp = require("amqplib");

(async () => {
  const conn = await amqp.connect("amqp://rabbitmq:rabbitmq@localhost:8080");
  {
    const channel = await conn.createChannel();
    channel.assertQueue("product.created");
    channel.consume("product.created", (msg) => {
      console.log(msg.content.toString());
    });
  }

  {
    const channel = await conn.createChannel();
    await channel.sendToQueue("product.created", Buffer.from("Hello world"));
  }
})();
