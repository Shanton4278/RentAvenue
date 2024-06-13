import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoleEnum } from '../enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true })
  fullName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  userName: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop({
    enum: UserRoleEnum,
    type: String,
  })
  userRole: UserRoleEnum;

  @Prop()
  refreshToken: string;

  @Prop({ type: Boolean, default: false })
  isProfileUpdated: boolean;

  @Prop({ type: Boolean, default: true })
  isFirstTimeLogin: boolean;

  @Prop()
  region: string;

  @Prop()
  city: string;

  @Prop()
  town: string;

  @Prop({ type: Date })
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
