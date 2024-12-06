import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const SearchDialog = ({ openSearch, setOpenSearch }) => {
    return (
        <Dialog open={openSearch} onOpenChange={setOpenSearch}>
            <DialogContent
                onInteractOutside={() => setOpenSearch(false)}
                className="max-w-full sm:max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
            >
                <DialogHeader className="flex flex-col items-center">
                    <DialogTitle className="text-xl font-semibold text-gray-800 mb-5">Search</DialogTitle>

                    <div className="w-full space-y-4">
                        <Input
                            placeholder="Search User By Name"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Search
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;
