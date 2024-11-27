import { ChangeEvent } from 'react';

import { IQuery } from '../../interfaces';
import { UseFormRegisterReturn } from 'react-hook-form';

interface IProps<T> {
    selectName: keyof IQuery;
    items: T[];
    handleOptionChange: (e: ChangeEvent<HTMLSelectElement>) => void | null;
    selectValue: string | number;
    placeholder: string;
    itemKey: keyof T;
    itemLabel: keyof T;
    register?: UseFormRegisterReturn;
}

const DropdownMenu = <T extends Record<string, any>>({
    selectName,
    items,
    handleOptionChange,
    selectValue,
    placeholder,
    itemKey,
    itemLabel,
    register,
}: IProps<T>) => {
    return (
        <select
            className="form-select"
            name={selectName}
            onChange={handleOptionChange}
            value={selectValue || ''}
            {...(register ? register : {})}
        >
            <option value={''}>{placeholder}</option>
            {items.map((item) => (
                <option
                    key={item[itemKey]}
                    value={
                        selectName === 'group' ? item[itemKey] : item[itemLabel]
                    }
                >
                    {item[itemLabel]}
                </option>
            ))}
        </select>
    );
};

export { DropdownMenu };
