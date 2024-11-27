import { MigrationInterface, QueryRunner } from "typeorm";
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';
import { EUserRole } from '../entities/enums/user-role.enum';
import { EOrderStatus } from '../entities/enums/order-status.enum';
import { ECourse } from '../entities/enums/course.enum';
import { ECourseType } from '../entities/enums/course-type.enum';
import { ECourseFormat } from '../entities/enums/course-format.enum';

dotenv.config({ path: `environments/local.env` });
export class CreateTables1723207425925 implements MigrationInterface {
    name = 'CreateTables1723207425925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('In work', 'New', 'Agree', 'Disagree', 'Dubbing') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course\` enum ('FS', 'QACX', 'JCX', 'JSCX', 'FE', 'PCX') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_type\` enum ('pro', 'minimal', 'premium', 'incubator', 'vip') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course_formats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_format\` enum ('static', 'online') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

      await queryRunner.query(`CREATE TABLE \`groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
      await queryRunner.query(`CREATE TABLE \`managers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` text NOT NULL, \`surname\` text NOT NULL, \`email\` text NOT NULL, \`password\` text NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`last_login\` datetime(6) NULL, \`user_role\` enum ('ADMIN', 'MANAGER') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
      await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`refreshToken\` text NOT NULL, \`deviceId\` text NOT NULL, \`manager_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
      await queryRunner.query(`ALTER TABLE \`orders\` ADD \`manager_id\` int NULL`);
      await queryRunner.query(`ALTER TABLE \`orders\` ADD \`group_id\` int NULL`);
      await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`id\` \`id\` bigint NOT NULL`);
      await queryRunner.query(`ALTER TABLE \`orders\` DROP PRIMARY KEY`);
      await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`id\``);
      await queryRunner.query(`ALTER TABLE \`orders\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
      await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_c23c7d2f3f13590a845802393d5\` FOREIGN KEY (\`manager_id\`) REFERENCES \`managers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_77b9403790bf253dd71cfcdb6a4\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_4a3d2a11e760de57a0cc674a281\` FOREIGN KEY (\`manager_id\`) REFERENCES \`managers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        const name = process.env.ADMIN_NAME;
        const surname = process.env.ADMIN_SURNAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const rounds = parseInt(process.env.HASH_PASSWORD_ROUNDS);

        const hashedPassword = await bcrypt.hash(password, rounds);

        await queryRunner.query(
          `INSERT INTO managers (name, surname, email, password, is_active, last_login, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, surname, email, hashedPassword, true, new Date(), EUserRole.ADMIN]
        );

        await queryRunner.query(`
          INSERT INTO order_status (id, status) VALUES 
          (1, '${EOrderStatus.NEW}'), 
          (2, '${EOrderStatus.IN_WORK}'), 
          (3, '${EOrderStatus.DUBBING}'), 
          (4, '${EOrderStatus.AGREE}'), 
          (5, '${EOrderStatus.DISAGREE}');
        `);

        await queryRunner.query(`
          INSERT INTO courses (id, course) VALUES 
          (1, '${ECourse.FE}'), 
          (2, '${ECourse.QACX}'), 
          (3, '${ECourse.PCX}'), 
          (4, '${ECourse.JCX}'), 
          (5, '${ECourse.FS}'), 
          (6, '${ECourse.JSCX}'); 
        `);

        await queryRunner.query(`
          INSERT INTO course_types (id, course_type) VALUES 
          (1, '${ECourseType.INCUBATOR}'), 
          (2, '${ECourseType.PREMIUM}'), 
          (3, '${ECourseType.PRO}'), 
          (4, '${ECourseType.VIP}'), 
          (5, '${ECourseType.MINIMAL}');
        `);

        await queryRunner.query(`
          INSERT INTO course_formats (id, course_format) VALUES 
          (1, '${ECourseFormat.ONLINE}'), 
          (2, '${ECourseFormat.STATIC}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_4a3d2a11e760de57a0cc674a281\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_c23c7d2f3f13590a845802393d5\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_23b0a2cbe638a33606043ea38aa\``);
        await queryRunner.query(`DROP INDEX \`REL_c23c7d2f3f13590a845802393d\` ON \`orders\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP INDEX \`IDX_c23c7d2f3f13590a845802393d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`manager_id\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`managers\``);
        await queryRunner.query(`DROP TABLE \`groups\``);
        await queryRunner.query(`DROP TABLE \`course_formats\``);
        await queryRunner.query(`DROP TABLE \`course_types\``);
        await queryRunner.query(`DROP TABLE \`courses\``);
        await queryRunner.query(`DROP TABLE \`order_status\``);

        await queryRunner.query(
          `DELETE FROM managers WHERE email = ?`,
          [process.env.ADMIN_EMAIL || 'admin@gmail.com']
        );

        await queryRunner.query(`
    DELETE FROM order_status WHERE status IN (
      '${EOrderStatus.NEW}', 
      '${EOrderStatus.IN_WORK}', 
      '${EOrderStatus.DUBBING}', 
      '${EOrderStatus.AGREE}', 
      '${EOrderStatus.DISAGREE}'
    );
  `);

        await queryRunner.query(`
    DELETE FROM courses WHERE course IN (
      '${ECourse.FE}', 
      '${ECourse.QACX}', 
      '${ECourse.PCX}', 
      '${ECourse.JCX}', 
      '${ECourse.FS}', 
      '${ECourse.JSCX}'
    );
  `);

        await queryRunner.query(`
    DELETE FROM course_types WHERE course_type IN (
      '${ECourseType.INCUBATOR}', 
      '${ECourseType.PREMIUM}', 
      '${ECourseType.PRO}', 
      '${ECourseType.VIP}', 
      '${ECourseType.MINIMAL}'
    );
  `);

        await queryRunner.query(`
    DELETE FROM course_formats WHERE course_format IN (
      '${ECourseFormat.ONLINE}', 
      '${ECourseFormat.STATIC}'
    );
  `);
    }

}
