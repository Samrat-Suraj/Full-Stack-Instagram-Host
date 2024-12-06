
import Posts from "./Posts"

const Feeds = () => {
    return (
        <div className="flex-1 overflow-scroll p-5 scrollbar-hide">
            <Posts />
        </div>
    );
};

export default Feeds;
