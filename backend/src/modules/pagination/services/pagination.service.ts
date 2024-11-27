import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { QueryReqDto } from '../dto/req/query.req.dto';
import { PaginationResDto } from '../dto/res/pagination.res.dto';
import { EOrder } from '../models/enums/order.enum';
import { RelationConfig } from '../models/types/relation-config.type';

@Injectable()
export class PaginationService {
  private ENTITY_ALIAS = 'entity';

  public async paginate<T>(
    query: QueryReqDto,
    repository: Repository<T>,
    relations: RelationConfig[],
    excludeUserId?: number,
  ): Promise<PaginationResDto<T>> {
    const {
      page,
      limit,
      order: enteredOrder,
      name,
      surname,
      email,
      phone,
      age,
      course,
      course_format,
      course_type,
      status,
      group,
      start_date,
      end_date,
      manager,
    } = query;

    const skip = (page - 1) * limit;

    const qb = repository.createQueryBuilder(this.ENTITY_ALIAS);

    const orderBy =
      enteredOrder && enteredOrder.startsWith('-')
        ? enteredOrder.slice(1)
        : enteredOrder;
    const order =
      enteredOrder && enteredOrder.startsWith('-') ? EOrder.DESC : EOrder.ASC;

    if (relations.length) {
      relations.forEach((relation) => {
        this.iterateRelation(relation, qb, this.ENTITY_ALIAS);
      });
    }
    if (enteredOrder) qb.addOrderBy(`${this.ENTITY_ALIAS}.${orderBy}`, order);

    if (name) this.setFilter(qb, 'name', name);
    if (surname) this.setFilter(qb, 'surname', surname);
    if (email) this.setFilter(qb, 'email', email);
    if (phone) this.setFilter(qb, 'phone', phone);
    if (age) this.setFilter(qb, 'age', age);
    if (course) this.setFilter(qb, 'course', course, true);
    if (course_format) this.setFilter(qb, 'course_format', course_format, true);
    if (course_type) this.setFilter(qb, 'course_type', course_type, true);
    if (status) this.setFilter(qb, 'status', status, true);
    if (group) this.setFilter(qb, 'group', group);
    if (start_date || end_date) this.setFilterByDate(qb, start_date, end_date);
    if (manager) this.setFilter(qb, 'manager', manager);
    if (excludeUserId) {
      qb.andWhere(`${this.ENTITY_ALIAS}.id != :excludeUserId`, {
        excludeUserId,
      });
    }

    const [data, totalCount] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      limit,
      page,
      totalCount,
    };
  }

  private iterateRelation<T>(
    relation: RelationConfig,
    qb: SelectQueryBuilder<T>,
    property: string,
    alias?: string,
  ) {
    Object.entries(relation).forEach(([key, value]) => {
      const nextAlias = alias ? `${alias}_${key}` : key;

      if (value && typeof value === 'object') {
        qb.leftJoinAndSelect(`${property}.${key}`, nextAlias);
        this.iterateRelation(value, qb, key, nextAlias);
      } else {
        if (value) {
          qb.leftJoinAndSelect(`${property}.${key}`, nextAlias);
        }
      }
    });
  }

  private setFilter<T, K extends keyof QueryReqDto>(
    qb: SelectQueryBuilder<T>,
    searchField: K,
    searchValue: string | number | Date,
    isEnum: boolean = false,
  ): SelectQueryBuilder<T> {
    if (typeof searchValue === 'number' || isEnum) {
      return qb.andWhere(
        `${this.ENTITY_ALIAS}.${searchField} = :${searchField}`,
        {
          [searchField]: searchValue,
        },
      );
    } else if (searchField === 'manager') {
      return qb.andWhere(`LOWER(manager.name) LIKE :${searchField}`, {
        [searchField]: `%${searchValue}%`,
      });
    }
    return qb.andWhere(
      `LOWER(${this.ENTITY_ALIAS}.${searchField}) LIKE :${searchField}`,
      {
        [searchField]: `%${searchValue}%`,
      },
    );
  }

  private setFilterByDate<T>(
    qb: SelectQueryBuilder<T>,
    start_date?: Date,
    end_date?: Date,
  ): SelectQueryBuilder<T> {
    if (start_date && end_date) {
      return qb.andWhere(
        `${this.ENTITY_ALIAS}.created_at >= :start_date AND ${this.ENTITY_ALIAS}.created_at <= :end_date`,
        { start_date, end_date },
      );
    } else if (start_date) {
      return qb.andWhere(`${this.ENTITY_ALIAS}.created_at >= :start_date`, {
        start_date,
      });
    } else if (end_date) {
      return qb.andWhere(`${this.ENTITY_ALIAS}.created_at <= :end_date`, {
        end_date,
      });
    }
    return qb;
  }
}
