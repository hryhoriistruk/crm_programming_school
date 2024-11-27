import { ChangeEvent, FC } from 'react';
import { UseFormRegister } from 'react-hook-form';

import { IQuery } from '../../interfaces';

interface IProps {
    placeholder: string;
    value: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    inputName: keyof IQuery;
    register: UseFormRegister<IQuery>;
}

const TextInput: FC<IProps> = ({
    placeholder,
    value,
    handleInputChange,
    inputName,
    register,
}) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (inputName === 'start_date' || inputName === 'end_date') {
            e.target.type = 'date';
        }
    };
    return (
        <div className={'col-md-2'}>
            <div className={`col-auto`}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value || ''}
                    className={`form-control`}
                    {...register(inputName)}
                    onFocus={handleFocus}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export { TextInput };
