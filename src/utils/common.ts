import * as bcrypt from 'bcrypt';

export async function compareData(plainData: string, hashedData: string): Promise<boolean> {
  return await bcrypt.compare(plainData, hashedData);
}


const saltRounds = 10;
export async function hashData(data: any): Promise<string> {
    return await bcrypt.hash(data, saltRounds);
  }