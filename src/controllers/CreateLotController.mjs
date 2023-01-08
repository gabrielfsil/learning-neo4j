import { driver } from "../connection.mjs";
import { randomUUID } from "crypto";

class CreateLotController {
  async create(request, response) {
    const { user, lot } = request.body;

    const session = driver.session({ database: "neo4j" });

    try {
      const writeQuery = `
                  MATCH (u1:User {
                      login: "${user.login}",
                      password: "${user.password}"
                  })
                  MERGE (l1:Lot {
                      title: "${lot.title}",
                      description: "${lot.description}",
                      minimum_value: "${lot.minimum_value}",
                      closing_value: "${lot.closing_value}",
                      start_date: "${lot.start_date}",
                      end_date: "${lot.end_date}"
                  })
                  MERGE (u1)-[:Vendedor]->(l1)
                  RETURN u1, l1`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery)
      );

      writeResult.records.forEach((record) => {
        const user = record.get("u1");
        const lot = record.get("l1");

        console.log(
          `Created lot of user: ${user.properties.name} has ${lot.properties.title}`
        );
      });

    } catch (error) {
      console.error(`Something went wrong: ${error}`);
      return response.status(400).json({
        error: `Something went wrong: ${error}`,
      });
    } finally {
      await session.close();
      return response.json();
    }
  }
}

export { CreateLotController };
