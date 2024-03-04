import {useToast} from "@/components/ui/use-toast"
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/state/store";
import {useEffect} from "react";
import {setToast} from "@/state/mainContent/mainContentSlice";

export const Footer = () => {
    const showToast = useSelector((state: RootState) => state.mainContent.showToast);
    const status = useSelector((state: RootState) => state.mainContent.status);
    const error = useSelector((state: RootState) => state.mainContent.error);
    const dispatch = useDispatch<AppDispatch>();
    const {toast} = useToast();


    const notify = () => {
        toast({
            variant: error ? "destructive" : "default",
            title: status,
        })
    }
    useEffect(() => {
        if (showToast){
            notify();
            dispatch(setToast())
        }

    }, [showToast]);

    return (<div className={'text-center'}>
            
        </div>
    )
}