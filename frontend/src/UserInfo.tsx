import {Input} from '@/components/ui/input';
import React, {useState} from "react";
import {useDispatch} from 'react-redux';
import {Button} from "@/components/ui/button";
import {setValidUser, validateUser} from '@/state/mainContent/mainContentSlice';
import {AppDispatch} from '@/state/store';


export const UserInfo = () => {
        const [telegramInfo, setTelegramInfo] = useState({
            token: '',
            ChatID: ''
        });
        const dispatch = useDispatch<AppDispatch>();
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setTelegramInfo({
                ...telegramInfo,
                [e.target.name]: value
            });
        };


        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = {
                token: telegramInfo.token,
                ChatID: telegramInfo.ChatID
            };
            dispatch(validateUser(formData));
            dispatch(setValidUser());
            setTelegramInfo({token: '', ChatID: ''});

        };


        return (<div>
                <form onSubmit={handleSubmit}>
                    <Input
                        id={'token'}
                        required={true}
                        placeholder={'Please input your Bot Token'}
                        name={'token'}
                        type="text"
                        onChange={handleChange}
                        value={telegramInfo.token}
                    />
                    <br/>
                    <Input
                        id={'ChatID'}
                        placeholder={'Please input your ChatID...'}
                        name={'ChatID'}
                        required={true}
                        type="text"
                        onChange={handleChange}
                        value={telegramInfo.ChatID}
                    />
                    <Button type={"submit"}>Submit</Button>
                </form>
            </div>
        )
    }
;