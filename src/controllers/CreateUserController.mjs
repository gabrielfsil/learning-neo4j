import { driver } from "../connection.mjs";


class CreateUserController{

    async create(request,response){
        const { user } = request.body;

        const session = driver.session({ database: "neo4j" });
    
        try {
          const writeQuery = `
                      CREATE (u1:User {
                          name: "${user.name}",
                          email: "${user.email}",
                          login: "${user.login}",
                          address: "${user.address}",
                          password: "${user.password}"
                      })
                      RETURN u1`;
    
          const writeResult = await session.executeWrite((tx) =>
            tx.run(writeQuery)
          );
    
          writeResult.records.forEach((record) => {
            const user = record.get("u1");
    
            console.log(
              `Created user: ${user.properties.name}`
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

export { CreateUserController }