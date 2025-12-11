import { app, prisma } from "@/main.ts";
import { env } from "../config/env.ts";


class Application {
   constructor() {
      this.server();
   }

   private async startDatabase() {
      try {
         await prisma.$connect();
         console.log(`🎲 Database connected`)
      }catch {
         console.log(`❌ Database disconnected`)
         await prisma.$disconnect()
      }
   }

   public async server() {
      const connectToDatabase = this.startDatabase.bind(this);

      await connectToDatabase();

      app.listen(env.PORT, () => {
         try {
            console.log(`🚀 Server started on port ${env.PORT}`)
         } catch (error) {
            console.error(error);
         }
      });
   }
}

new Application()