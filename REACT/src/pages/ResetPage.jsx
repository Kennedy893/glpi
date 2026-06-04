import { useResetData } from "../hooks/reset/useResetData"

export const ResetPage = () => {
    const { resetData, loading, logs } = useResetData();

    const handleReset = async () => {
        const response = await resetData();
    };

    return (
        <button onClick={handleReset}>Reinitialiser</button>
    );
}