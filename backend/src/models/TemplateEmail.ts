import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey
  } from "sequelize-typescript";
import Company from "./Company";
  
  @Table({ tableName: "EmailTemplate" })
  class TemplateEmail extends Model<TemplateEmail> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    name: string;

    @Column
    html: string;

    @Column
    design: string;

    @ForeignKey(() => Company)
    @Column
    companyId: number;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  }
  
  export default TemplateEmail;
  