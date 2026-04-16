import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { EventsService, type PaginatedEventsResponse } from "../services/events.service";

const eventsService = new EventsService();

const EventsPage: React.FC = () => {
  const [data, setData] = useState<PaginatedEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const limit = 5;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await eventsService.getPaginatedEvents(page, limit);
        setData(result);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erreur lors du chargement des événements");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [page]);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="warning">Aucune donnée disponible.</Alert>;
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Typography variant="h4">Événements</Typography>

      {data.items.length === 0 ? (
        <Alert severity="info">Aucun événement disponible pour le moment.</Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {data.items.map((event) => (
            <Card key={event.props.id}>
              <CardContent>
                <Typography variant="h6">{event.props.title}</Typography>

                {event.props.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.props.description}
                  </Typography>
                )}

                <Typography variant="body2">
                  Date : {new Date(event.props.startDate).toLocaleDateString()}
                </Typography>

                <Typography variant="body2">
                  Capacité : {event.props.capacity}
                </Typography>

                {event.props.price !== undefined && (
                  <Typography variant="body2">
                    Prix : {event.props.price} €
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Précédent
        </Button>

        <Typography>
          Page {data.page} / {data.totalPages || 1}
        </Typography>

        <Button
          variant="outlined"
          disabled={data.totalPages === 0 || page >= data.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default EventsPage;