import { CategoryIcon } from "../components/CategoryIcon";

export default function Dashboard() {
    return (
        <div className="flex gap-2">
            <CategoryIcon icon="utensils" color="blue" />
            <CategoryIcon icon="car-front" color="purple" />
            <CategoryIcon icon="piggy-bank" color="green" />
        </div>
    );
}
