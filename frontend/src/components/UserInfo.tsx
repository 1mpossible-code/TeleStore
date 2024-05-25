import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import cn from 'classnames';
import {HashLoader} from 'react-spinners'

import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';

import React, { useState } from 'react';
import axios from 'axios';
import { getValidUser } from '@/state/mainContent/mainContentSlice';

export const UserInfo = () => {
  const [clicked,SetClicked] = useState(false)

  const [telegramInfo, setTelegramInfo] = useState({
    token: '',
    chat_id: 0,
  });
  const dispatch = useDispatch<AppDispatch>();

  const isValid = useSelector(
    (state: RootState) => state.mainContent.validUser
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelegramInfo((prevState) => ({
      ...prevState,
      token: value,
    }));
  };

  const handleSave = () => {
    const { token, chat_id } = telegramInfo;
    const payload = { token, chat_id };
    console.log(payload);
    axios.post('http://localhost:3000/secret', payload);
  };

  const fetchChatID = async () => {
    try {
      const status = await (
        await axios.get('http://127.0.0.1:3000/start')
      ).status;
      console.log(status);
      dispatch(getValidUser());
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await axios.get('http://127.0.0.1:3000/secret');
      console.log(res);
      setTelegramInfo((prevState) => ({
        ...prevState,
        chat_id: res.data.chat_id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog defaultOpen={!isValid}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={(e) => {
          !telegramInfo.chat_id ? e.preventDefault() : e;
        }}
        onPointerDownOutside={(e) => {
          !telegramInfo.chat_id ? e.preventDefault() : e;
        }}
      >
        <DialogHeader>
          <DialogTitle className="mb-5">User Preferences ⚙️</DialogTitle>
          <DialogDescription>
            {telegramInfo.chat_id && telegramInfo.token
              ? "Edit your token here to change your bot"
              : telegramInfo.token
              ? 'Once full token is submitted, please send "/start" to your bot'
              : `Please input your bot's token to continue`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 pr-10">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="font-bold text-right">
              Token
            </Label>
            <Input
              className=" col-span-3"
              id={'token'}
              placeholder={'Please input your Bot Token'}
              name={'token'}
              type="text"
              onChange={handleChange}
              value={telegramInfo.token}
            />
          </div>
          <div
            className={cn(
              isValid ? 'grid grid-cols-4 items-center gap-4' : 'hidden'
            )}
          >
            <Label htmlFor="username" className=" font-bold text-right">
              ChatID
            </Label>

            <Input
              readOnly
              className="col-span-3"
              id={'chat_id'}
              placeholder={'ChatID will show here'}
              name={'chat_id'}
              required={true}
              type="text"
              value={telegramInfo.chat_id}
            />
          </div>
        </div>
        <DialogFooter className=" w-10/12 mx-auto flex-col md:flex-end md:justify-end md:w-full">
          {clicked ? (

            <HashLoader color="#36d7b7" />
          ) : (
            <Button
              className={'text-white mt-5 md:mt-0'}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
                fetchChatID();
                SetClicked(true);
              }}
            >
              Continue
            </Button>
          )}
          <DialogClose asChild>
            <Button
              className={cn(isValid ? 'block' : 'hidden')}
              type="button"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
