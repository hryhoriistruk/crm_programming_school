import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedCommentsTable1727284553836 implements MigrationInterface {
    name = 'CreatedCommentsTable1727284553836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`text\` text NOT NULL, \`orderId\` int NULL, \`managerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`name\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD UNIQUE INDEX \`IDX_664ea405ae2a10c264d582ee56\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_c05f4c1d32c34e63e35c7ae7c67\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8618150cbb4f2e0d8054de6ddfa\` FOREIGN KEY (\`managerId\`) REFERENCES \`managers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8618150cbb4f2e0d8054de6ddfa\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_c05f4c1d32c34e63e35c7ae7c67\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP INDEX \`IDX_664ea405ae2a10c264d582ee56\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`name\` text NOT NULL`);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}
