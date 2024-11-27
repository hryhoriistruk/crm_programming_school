import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as process from "node:process";

export class insertInitialData20240801000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    const dumpFilePath = path.resolve(__dirname, path.join(process.cwd(), 'orders.sql'));
    const dumpFile = fs.readFileSync(dumpFilePath, { encoding: 'utf-8' });

    const queries = dumpFile.split(';').filter(query => query.trim());
    for (const query of queries) {
      await queryRunner.query(query);
    }

    await queryRunner.query(`UPDATE orders SET course = NULL WHERE course NOT IN ('FS', 'QACX', 'JCX', 'JSCX', 'FE', 'PCX') OR course IS NULL`);
    await queryRunner.query(`UPDATE orders SET course_format = NULL WHERE course_format NOT IN ('static', 'online') OR course_format IS NULL`);
    await queryRunner.query(`UPDATE orders SET course_type = NULL WHERE course_type NOT IN ('pro', 'minimal', 'premium', 'incubator', 'vip') OR course_type IS NULL`);
    await queryRunner.query(`UPDATE orders SET status = NULL WHERE status NOT IN ('In work', 'New', 'Agree', 'Disagree', 'Dubbing') OR status IS NULL`);

    await queryRunner.query(`ALTER TABLE orders MODIFY course ENUM('FS', 'QACX', 'JCX', 'JSCX', 'FE', 'PCX') NULL`);
    await queryRunner.query(`ALTER TABLE orders MODIFY course_format ENUM('static', 'online') NULL`);
    await queryRunner.query(`ALTER TABLE orders MODIFY course_type ENUM('pro', 'minimal', 'premium', 'incubator', 'vip') NULL`);
    await queryRunner.query(`ALTER TABLE orders MODIFY status ENUM('In work', 'New', 'Agree', 'Disagree', 'Dubbing') NULL`);

    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`name\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`surname\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`email\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`phone\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`utm\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` MODIFY \`msg\` text NULL`);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`msg\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`msg\` varchar(100) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`utm\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`utm\` varchar(100) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`status\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`status\` varchar(15) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`course_type\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`course_type\` varchar(100) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`course_format\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`course_format\` varchar(15) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`course\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`course\` varchar(10) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`phone\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`phone\` varchar(12) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`email\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`email\` varchar(100) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`surname\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`surname\` varchar(25) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`name\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`name\` varchar(25) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` datetime(6) NULL`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD \`id\` bigint NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`orders\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP INDEX \`IDX_c23c7d2f3f13590a845802393d\``);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
  }
}
