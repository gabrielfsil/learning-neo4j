import { driver } from "../connection.mjs";

class CreateThrowController {
  async create(request, response) {
    const { user, lot, value, date } = request.body;

    const session = driver.session({ database: "neo4j" });

    try {
      const writeQuery = `
                  MATCH (u1:User {
                      login: "${user.login}",
                      password: "${user.password}"
                  })
                  MATCH (l1:Lot {
                      title: "${lot.title}"
                  })
                  MERGE (u1)-[l2:Lance { value: "${value}", date: "${date}" }]->(l1)
                  RETURN u1, l1`;

      const writeResult = await session.executeWrite((tx) =>
        tx.run(writeQuery)
      );

      writeResult.records.forEach((record) => {
        const user = record.get("u1");
        const lot = record.get("l1");

        console.log(
          `Created throw of user: ${user.properties.name} has ${lot.properties.title}`
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

export { CreateThrowController };
