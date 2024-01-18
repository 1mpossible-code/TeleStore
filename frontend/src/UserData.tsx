export type Uploads = {
  id: number;
  name: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  size: number;
};

const UserData: Uploads[] = [
  {
    id: 15,
    name: 'IMG_2F17AD586535-1.jpeg',
    status: 'success',
    size: 1020207,
  },
  {
    id: 16,
    name: 'DOC_4G56FD986235-2.pdf',
    status: 'pending',
    size: 500234,
  },
  {
    id: 17,
    name: 'VID_7H34GF978123-3.mp4',
    status: 'failed',
    size: 2048576,
  },
  {
    id: 18,
    name: 'AUDIO_8J98FD123456-4.mp3',
    status: 'success',
    size: 320020,
  },
  {
    id: 19,
    name: 'ARCH_ZIP099812345-5.zip',
    status: 'success',
    size: 1024000,
  },
];

export default UserData;
