import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import api from "@/lib/axios";
import CodeEditor from "@/components/codeEditor..tsx";
import {getModeFromLang} from "@/lib/utils.ts";
import Map from "@/components/map.tsx";

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

interface TestCase {
    input: string;
    expectedOutput: string;
    order: number;
}

interface ChallengeCode {
    id: number;
    code: string;
    language: string;
}

interface OptimalSolution {
    id: number;
    code: string;
    language: string;
}

interface Challenge {
    challengeId: number;
    title: string;
    description: string;
    points: number;
    challengeType: string;
    externalGameUri: string | null;
    testCases: TestCase[];
    optimalSolutions: OptimalSolution[];
    challengeCodes: ChallengeCode[];
    createdAt: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    score: number | null;
}

interface Comment {
    id: number;
    huntId: string;
    content: string;
    reviewerId: number;
}


export function HuntDetailsPage() {
    const {huntId} = useParams<{ huntId: string }>();
    const navigate = useNavigate();
    const [hunt, setHunt] = useState<Hunt | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [organizer, setOrganizer] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [comment, setComment] = useState(""); // State for the comment
    const [comments, setComments] = useState<Comment[]>([]); // State for the comment

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const newComment = await api.post<Comment>(`/hunts/${huntId}/comments`, {content: comment});
            setComment(""); // Clear the input field
            setComments((prevComments) => [
                ...prevComments,
                newComment.data, // Add the new comment to the state
            ]);
        } catch (err) {
            console.error("Error submitting comment:", err);
        }
    };

    useEffect(() => {
        const fetchHuntDetails = async () => {
            if (!huntId) return;

            setIsLoading(true);
            setError("");

            try {
                // Fetch hunt details
                const [huntResponse, challengesResponse, comments] = await Promise.all([
                    api.get<Hunt>(`/hunts/${huntId}`),
                    api.get<Challenge[]>(`/hunts/${huntId}/challenges`),
                    api.get<Comment[]>(`/hunts/${huntId}/comments`),
                ]);
                setComments(comments.data);
                setHunt(huntResponse.data);
                setChallenges(challengesResponse.data);
                const organizerResponse = await api.get(`/users/${huntResponse.data.organizerId}`);
                setOrganizer(organizerResponse.data);

            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch hunt details. Please try again later."
                );
                console.error("Error fetching hunt details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHuntDetails();
    }, [huntId]);

    const handleBackClick = () => {
        navigate("/");
    };

    const handleResolveComment = async (id: number) => {
        await api.delete(`/comments/${id}`).then(() => {
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
        }).catch((err) => {
            console.error("Error resolving comment:", err);
        });
    }

    const renderChallengeCard = (challenge: Challenge) => (
        <Card key={challenge.challengeId} className="mb-6">
            <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription>
                    Type: {challenge.challengeType} | Points: {challenge.points}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm">{challenge.description}</p>
                </div>

                {challenge.externalGameUri && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Game Link</h3>
                        <a
                            href={challenge.externalGameUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {challenge.externalGameUri}
                        </a>
                    </div>
                )}

                {challenge.testCases.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Test Cases</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium">Input</div>
                            <div className="font-medium">Expected Output</div>
                            <div className="font-medium">Order</div>
                            {challenge.testCases.map((testCase, index) => (
                                <React.Fragment key={index}>
                                    <div className="border p-1 rounded">{testCase.input}</div>
                                    <div className="border p-1 rounded">{testCase.expectedOutput}</div>
                                    <div className="border p-1 rounded">{testCase.order}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {challenge.challengeCodes.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Challenge Code</h3>
                        {challenge.challengeCodes.map((code, index) => (
                            <div key={index} className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Language: {code.language}</p>
                                <CodeEditor readonly={true} code={code.code} height={"500px"}
                                            language={getModeFromLang(code.language)}/>
                                {/*<pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">*/}
                                {/*{code.code}*/}
                                {/*</pre>*/}
                            </div>
                        ))}
                    </div>
                )}

                {challenge.optimalSolutions.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">Optimal Solutions</h3>
                        {challenge.optimalSolutions.map((solution, index) => (
                            <div key={index} className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Language: {solution.language}</p>
                                <CodeEditor readonly={true} code={solution.code} height={"500px"}
                                            language={getModeFromLang(solution.language)}/>
                                {/*                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">*/}
                                {/*  {solution.code}*/}
                                {/*</pre>*/}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <p>Loading hunt details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="p-3 mb-4 text-sm text-white bg-destructive rounded">
                    {error}
                </div>
                <Button onClick={handleBackClick}>Back to Dashboard</Button>
            </div>
        );
    }

    if (!hunt) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <p>Hunt not found.</p>
                <Button onClick={handleBackClick} className="mt-4">Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className={"flex justify-between items-center mb-4"}>
                <Button
                    variant="outline"
                    onClick={handleBackClick}
                    className="mb-4"
                >
                    &larr; Back to Dashboard
                </Button>
                <Button className={"bg-red-500 hover:bg-red-600"}
                        onClick={async () => {
                            const response = await api.post(`/reviewers/hunts/${hunt.id}`);
                            if (response.status !== 200) {
                                alert("Fuck you")
                                return;
                            }
                            navigate("/");
                        }}>
                    Unassign me
                </Button>
            </div>
            <Card className="mb-6">
                <div
                    // className="absolute inset-0 opacity-20 bg-cover bg-center"
                    style={{ backgroundImage: "url('/path-to-your-treasure-map.png')" }}
                >
                    <img src={`http://localhost:8080/api/v1/treasure-hunt/hunts/${hunt.id}/images/bg`} alt="hunt background"/>
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl">{hunt.title}</CardTitle>
                    <CardDescription>Status: {hunt.huntStatus}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p>{hunt.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Organizer Email:</span> {organizer?.email}
                        </div>
                        <div>
                            <span className="font-semibold">Hunt ID:</span> {hunt.id}
                        </div>
                        <div>
                            <span className="font-semibold">Start Date:</span> {hunt.startDate || 'Not set'}
                        </div>
                        <div>
                            <span className="font-semibold">End Date:</span> {hunt.endDate || 'Not set'}
                        </div>
                        {hunt.location && (
                            <div className="col-span-2">
                                <span
                                    className="font-semibold">Location:</span> {hunt.location.latitude.toFixed(6)}, {hunt.location.longitude.toFixed(6)}
                                <Map lat={hunt.location.latitude} lng={hunt.location.longitude} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Challenges</h2>
            {challenges.length > 0 ? (
                challenges.map(renderChallengeCard)
            ) : (
                <p>No challenges found for this hunt.</p>
            )}


            <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
            <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-40 p-2 border rounded mb-2"
            placeholder="Write your comment here..."
        />
                <Button type="submit" className="w-full">Submit Comment</Button>
            </form>

            {
                comments.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        {comments.map((com, index) => (
                            <div key={index} className="p-3 mb-4 text-sm bg-gray-100 rounded">
                                <div className="flex justify-between items-start gap-4">
                                    <p className="break-words flex-1 min-w-0">
                                        {com.content}
                                    </p>
                                    <Button onClick={() => {
                                        handleResolveComment(com.id);
                                    }}>
                                        Resolve
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No comments yet.</p>
                )
            }

        </div>
    );
}