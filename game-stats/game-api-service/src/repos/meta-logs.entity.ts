import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";


@Entity()
export class _MetaLogs extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({name: 'match_id'})
    matchId: string

    @Column({name: 'raw_log'})
    rawLog: string
    
    @Column({ name: 'log_time' })
    logTime: Date

    @Column({ name: 'log_pattern_type'})
    logPatternType: string

    @Column({ name: 'log_parsed_items'})
    logParsedItems: string
}