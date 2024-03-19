import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button";
import cn from 'classnames'


import React, {useState} from "react";
import {useDispatch} from 'react-redux';
import {setValidUser, validateUser} from '@/state/mainContent/mainContentSlice';
import {AppDispatch} from '@/state/store';

export const UserInfo = () => {

        const tokenReceived = false;

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

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className={'bg-blue-700'} variant="outline">User Preferences</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>User Preferences ⚙️</DialogTitle>
                        <DialogDescription>
                            {tokenReceived? 'Configure file saving location':'Input your token to continue'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">

                                <Label htmlFor="name" className="font-bold text-right">
                                    Token
                                </Label>
                                <Input
                                    className="col-span-3"
                                    id={'token'}
                                    required={true}
                                    placeholder={'Please input your Bot Token'}
                                    name={'token'}
                                    type="text"
                                    onChange={handleChange}
                                    value={telegramInfo.token}
                                />
                            </div>
                            <div className={cn(tokenReceived? "grid grid-cols-4 items-center gap-4": "hidden")}>
                                <Label htmlFor="username" className=" font-bold text-right">
                                    ChatID
                                </Label>
                                <Input
                                    className="col-span-3"
                                    id={'ChatID'}
                                    placeholder={'Please input your ChatID...'}
                                    name={'ChatID'}
                                    required={true}
                                    type="text"
                                    onChange={handleChange}
                                    value={telegramInfo.ChatID}
                                />

                            </div>

                        </div>
                        <DialogFooter>
                            <Button className={'text-white'} type="submit">Continue</Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

        )
    }
;