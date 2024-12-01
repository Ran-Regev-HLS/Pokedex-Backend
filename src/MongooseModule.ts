import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';


function getMongoURI(envName: string): string {
  switch (envName) {
    case 'local':
      return process.env.MONGO_URI_LOCAL!;
    case 'dev':
      return process.env.MONGO_URI_DEV!;
    case 'staging':
      return process.env.MONGO_URI_STAGING!;
    case 'production':
      return process.env.MONGO_URI_PRODUCTION!;
    case 'tests':
      return process.env.MONGO_URI_TESTS!;
    default:
      throw new Error(`Unknown environment: ${envName}`);
  }
}

function getConnectionSettings(): Record<string, unknown> {
  return {
    dbName: process.env.DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
}

export const MongooseModule = NestMongooseModule.forRootAsync({
  useFactory: async () => {
    const envName = process.env.NODE_ENV || 'local';
    const uri = getMongoURI(envName);

    if (!uri) {
      throw new Error(`Mongo URI not defined for environment: ${envName}`);
    }

    const connectionSettings = getConnectionSettings();

    return {
      uri,
      ...connectionSettings,
    };
  },
});
