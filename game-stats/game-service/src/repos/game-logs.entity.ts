import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";


@Entity()
export class GameLogs extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    log: string

    @Column()
    parsed_log: string
}