import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Company from "./Company";
import ContactList from "./ContactList";
import TemplateEmail from "./TemplateEmail";
import SignEmail from "./SignEmail"; // Adicionado o import do SignEmail
import User from "./User";

@Table({ tableName: "CampaignEmail" })
class Email extends Model<Email> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  title: string;

  @Column
  description: string;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @ForeignKey(() => ContactList)
  @Column
  contactListId: number;

  @BelongsTo(() => ContactList)
  contactList: ContactList;

  @ForeignKey(() => TemplateEmail)
  @Column
  templateId: number;

  @BelongsTo(() => TemplateEmail)
  template: TemplateEmail;

  @ForeignKey(() => SignEmail)
  @Column
  dkimId: number;

  @BelongsTo(() => SignEmail)
  dkim: SignEmail;

  @ForeignKey(() => User)
  @Column
  from: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Email;
