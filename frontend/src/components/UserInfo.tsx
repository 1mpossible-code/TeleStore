import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import cn from 'classnames';

import React, { useState } from 'react';
import axios from 'axios';

export const UserInfo = () => {
  const [telegramInfo, setTelegramInfo] = useState({
    token: '',
    chat_id: '',
  });

  // [open,setOpen] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelegramInfo({
      ...telegramInfo,
      [e.target.name]: value,
    });
  };

  // const fetchChatID = () => {
  //     axios.get('http://127.0.0.1:3000/start')
  //         .then(function (response) {
  //             // handle success
  //             console.log(response.data.ChatID);
  //             // setTelegramInfo({
  //             //     token: '',
  //             //     ChatID: response.data.ChatID
  //             // });
  //         })
  //
  // };

  return (
    <Dialog defaultOpen={!telegramInfo.chat_id}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>User Preferences ⚙️</DialogTitle>
          <DialogDescription>
            {telegramInfo.token
              ? ''
              : 'Input your token to continue'}
          </DialogDescription>
        </DialogHeader>
        <form action="http://127.0.0.1:3000/secret" method="post">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="font-bold text-right">
                Token
              </Label>
              <Input
                className="col-span-3"
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
                telegramInfo.token
                  ? 'grid grid-cols-4 items-center gap-4'
                  : 'hidden'
              )}
            >
              <Label htmlFor="username" className=" font-bold text-right">
                ChatID
              </Label>
              <Input
                className="col-span-3"
                id={'chat_id'}
                placeholder={'ChatID will show here'}
                name={'chat_id'}
                required={true}
                type="text"
                value={telegramInfo.chat_id || 'test'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className={'text-white'}
              type={'submit'}
              onClick={(e) => {
                e.preventDefault();

                // fetchChatID();
              }}
            >
              {' '}
              Get ChatID
            </Button>
            <Button
              className={'text-white'}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                const { token, chat_id } = telegramInfo;
                const payfuckingload = { token, chat_id };
                console.log(payfuckingload);
                axios.post('http://localhost:3000/secret', payfuckingload);
              }}
            >
              Save Changes{' '}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
