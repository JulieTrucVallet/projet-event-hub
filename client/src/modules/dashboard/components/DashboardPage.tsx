import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DashboardService, type DashboardData } from "../services/dashboard.service";

const dashboardService = new DashboardService();

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await dashboardService.getStats();
        setData(result);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erreur lors du chargement du dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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

  const statCards = [
    { label: "Utilisateurs", value: data.totals.users },
    { label: "Événements", value: data.totals.events },
    { label: "Événements à venir", value: data.totals.upcomingEvents },
    { label: "Événements passés", value: data.totals.pastEvents },
    { label: "Utilisateurs avec 2FA", value: data.totals.twoFaEnabledUsers },
  ];

  return (
    <Box sx={{ display: "grid", gap: 4 }}>
      <Typography variant="h4">Dashboard</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
        }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h4">{stat.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Événements par catégorie
            </Typography>

            {data.eventsByCategory.length === 0 ? (
              <Typography color="text.secondary">
                Aucun événement pour le moment.
              </Typography>
            ) : (
              <List dense>
                {data.eventsByCategory.map((item) => (
                  <ListItem key={item.categoryId} sx={{ px: 0 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{item.categoryName}</span>
                      <strong>{item.count}</strong>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Événements par mois
            </Typography>

            {data.eventsByMonth.length === 0 ? (
              <Typography color="text.secondary">
                Aucun événement pour le moment.
              </Typography>
            ) : (
              <List dense>
                {data.eventsByMonth.map((item) => (
                  <ListItem key={item.month} sx={{ px: 0 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{item.month}</span>
                      <strong>{item.count}</strong>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;