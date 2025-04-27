import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import api from "@/lib/axios";

interface Hunt {
    id: number;
    title: string;
    description: string;
    organizerId: number;
    reviewerId: number;
    startDate: string | null;
    endDate: string | null;
    huntStatus: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

interface Sort {
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    ascending: boolean;
    descending: boolean;
}

interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

interface HuntsResponse {
    content: Hunt[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort[];
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}


export function DashboardPage() {
    const navigate = useNavigate();
    const [availableHunts, setAvailableHunts] = useState<Hunt[]>([]);
    const [assignedHunts, setAssignedHunts] = useState<Hunt[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHunts = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Fetch available hunts
            const availableResponse = await api.get<HuntsResponse>("/hunts?status=UNDER_REVIEW");
            setAvailableHunts(availableResponse.data.content);

            // Fetch assigned hunts
            const assignedResponse = await api.get<Hunt[]>("/hunts/reviewers/me");
            setAssignedHunts(assignedResponse.data);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch hunts. Please try again later."
            );
            console.error("Error fetching hunts:", err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchHunts();
    }, []);

    const handleHuntClick = (huntId: number) => {
        navigate(`/hunt/${huntId}`);
    };

    const renderHuntCard = (hunt: Hunt, assigned?: boolean) => (
        <Card
            key={hunt.id}
            className="mb-4 cursor-pointer hover:shadow-md transition-shadow relative"
        >
            {
                !hunt.reviewerId && (
                    <div className={"absolute right-0 top-0 mt-2 mr-2"}>
                        <Button onClick={async () => {
                            const response = await api.post(`/reviewers/hunts/${hunt.id}`);
                            if (response.status !== 200) {
                                alert("Fuck you")
                                return;
                            }
                            await fetchHunts();

                        }}>
                            Assign me
                        </Button>
                    </div>
                )
            }

            <CardHeader>
                <CardTitle>{hunt.title}</CardTitle>
                <CardDescription>
                    <p>
                        Status: {hunt.huntStatus}
                    </p>
                    {
                        hunt.reviewerId ?
                            (
                                <p>
                                    Reviewer ID: {hunt.reviewerId}
                                </p>
                            )
                            : (
                                <p>No assigned reviewer</p>
                            )
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{hunt.description}</p>
                {hunt.location && (
                    <p className="text-xs text-gray-500 mt-2">
                        Location: {hunt.location.latitude.toFixed(6)}, {hunt.location.longitude.toFixed(6)}
                    </p>
                )}
            </CardContent>
            <CardFooter>
                {assigned ? (
                    <Button
                        variant="outline"
                        className="w-full font-bold"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleHuntClick(hunt.id);
                        }}
                    >
                        REVIEW DETAILS
                    </Button>
                ): null}
            </CardFooter>
        </Card>
    );

    return (
        <div className="w-full mx-auto p-4 min-h-screen">
            {/*<h1 className="text-3xl font-bold mb-6">Reviewer Dashboard</h1>*/}

            {error && (
                <div className="p-3 mb-4 text-sm text-white bg-destructive rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Hunts</h2>
                    {isLoading ? (
                        <p>Loading available hunts...</p>
                    ) : availableHunts?.length > 0 ? (
                        availableHunts.map((hunt) => {
                            return renderHuntCard(hunt, false);
                        })
                    ) : (
                        <p>No available hunts found.</p>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Assigned Hunts</h2>
                    {isLoading ? (
                        <p>Loading assigned hunts...</p>
                    ) : assignedHunts?.length > 0 ? (
                        assignedHunts.map((hunt) => {
                            return renderHuntCard(hunt, true);
                        })
                    ) : (
                        <p>No assigned hunts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}