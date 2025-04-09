'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { DollarSign, Package, ShoppingCart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Montserrat } from "next/font/google";

// Configuration de la police Montserrat avec display: "swap"
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

// Types
interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  totalSold: number
  revenue: number
}

interface Sale {
  id: string
  buyerName: string
  productName: string
  quantity: number
  totalPaid: number
  date: Date
}

interface SalesData {
  name: string
  sales: number
}

export default function AdminDashboard() {
  const [userName, setUserName] = useState('Mtf'); // from db
  const [activeTab, setActiveTab] = useState('week');
  const [topSellingProduct, setTopSellingProduct] = useState<Product | null>(null); // from db
  const [topRevenueProduct, setTopRevenueProduct] = useState<Product | null>(null); // from db
  const [recentSales, setRecentSales] = useState<Sale[]>([]); // from db
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  // Fetch dashboard data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchDashboardData(activeTab)
      .then(() => setIsLoading(false))
      .catch((err) => {
        setError("Erreur lors du chargement des données.");
        setIsLoading(false);
        console.error(err);
      });
  }, [activeTab]);

  const fetchDashboardData = async (period: string) => {
    let data: SalesData[] = [];

    switch (period) {
      case 'day':
        data = [
          { name: '00h-04h', sales: 5 },
          { name: '04h-08h', sales: 2 },
          { name: '08h-12h', sales: 8 },
          { name: '12h-16h', sales: 15 },
          { name: '16h-20h', sales: 25 },
          { name: '20h-24h', sales: 18 },
        ];
        break;
      case 'week':
        data = [
          { name: 'Lun', sales: 45 },
          { name: 'Mar', sales: 52 },
          { name: 'Mer', sales: 49 },
          { name: 'Jeu', sales: 62 },
          { name: 'Ven', sales: 78 },
          { name: 'Sam', sales: 85 },
          { name: 'Dim', sales: 70 },
        ];
        break;
      case 'month':
        data = [
          { name: 'Semaine 1', sales: 320 },
          { name: 'Semaine 2', sales: 280 },
          { name: 'Semaine 3', sales: 310 },
          { name: 'Semaine 4', sales: 350 },
        ];
        break;
      case 'year':
        data = [
          { name: 'Jan', sales: 1200 },
          { name: 'Fév', sales: 1100 },
          { name: 'Mar', sales: 1300 },
          { name: 'Avr', sales: 1400 },
          { name: 'Mai', sales: 1500 },
          { name: 'Juin', sales: 1700 },
          { name: 'Juil', sales: 1600 },
          { name: 'Août', sales: 1400 },
          { name: 'Sep', sales: 1300 },
          { name: 'Oct', sales: 1200 },
          { name: 'Nov', sales: 1500 },
          { name: 'Déc', sales: 1800 },
        ];
        break;
    }

    setSalesData(data);

    // Simuler un appel API pour les produits
    setTopSellingProduct({
      id: '1',
      name: 'Premium Headphones',
      price: 199.99,
      imageUrl: '/images/headphones.jpg',
      totalSold: 543,
      revenue: 108594.57,
    });

    setTopRevenueProduct({
      id: '2',
      name: 'Gaming Laptop',
      price: 1299.99,
      imageUrl: '/images/laptop.jpg',
      totalSold: 126,
      revenue: 163798.74,
    });

    setRecentSales([
      {
        id: 's1',
        buyerName: 'John Doe',
        productName: 'Gaming Laptop',
        quantity: 1,
        totalPaid: 1299.99,
        date: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      },
      {
        id: 's2',
        buyerName: 'Jane Smith',
        productName: 'Premium Headphones',
        quantity: 2,
        totalPaid: 399.98,
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: 's3',
        buyerName: 'Mike Johnson',
        productName: 'Wireless Keyboard',
        quantity: 1,
        totalPaid: 89.99,
        date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      },
      {
        id: 's4',
        buyerName: 'Sarah Williams',
        productName: 'Smart Watch',
        quantity: 1,
        totalPaid: 249.99,
        date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
      {
        id: 's5',
        buyerName: 'David Brown',
        productName: 'Bluetooth Speaker',
        quantity: 2,
        totalPaid: 159.98,
        date: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
    ]);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);

    if (diffMin < 1) {
      return 'maintenant';
    } else if (diffMin < 60) {
      return `${diffMin} min ago`;
    } else if (diffHour < 24) {
      return `${diffHour} heure${diffHour > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1
            className={`text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bonjour, {userName}
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue dans l'aperçu de votre tableau de bord des ventes
          </p>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl font-semibold text-gray-800">Chargement...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Sales Chart */}
            <Card className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle
                  className={`text-2xl font-semibold text-gray-800 ${montserrat.className}`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Aperçu des ventes
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Visualisez vos performances de vente par période
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="week" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100 rounded-lg p-1">
                    <TabsTrigger
                      value="day"
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      Jour
                    </TabsTrigger>
                    <TabsTrigger
                      value="week"
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      Semaine
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      Mois
                    </TabsTrigger>
                    <TabsTrigger
                      value="year"
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      Année
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="day" className="space-y-4">
                    <ChartDisplay data={salesData} />
                  </TabsContent>

                  <TabsContent value="week" className="space-y-4">
                    <ChartDisplay data={salesData} />
                  </TabsContent>

                  <TabsContent value="month" className="space-y-4">
                    <ChartDisplay data={salesData} />
                  </TabsContent>

                  <TabsContent value="year" className="space-y-4">
                    <ChartDisplay data={salesData} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Product Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Sold Product Card */}
              <Card className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Produit le plus vendu
                  </CardTitle>
                  <Package className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  {topSellingProduct ? (
                    <div className="space-y-2">
                      <p
                        className={`text-2xl font-bold text-gray-900 ${montserrat.className}`}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {topSellingProduct.name}
                      </p>
                      <div className="flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4 text-gray-500" />
                        <p className="text-gray-600">
                          {topSellingProduct.totalSold} unités vendues
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Aucune donnée disponible...</p>
                  )}
                </CardContent>
              </Card>

              {/* Highest Revenue Product Card */}
              <Card className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Produit à revenus les plus élevés
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  {topRevenueProduct ? (
                    <div className="space-y-2">
                      <p
                        className={`text-2xl font-bold text-gray-900 ${montserrat.className}`}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {topRevenueProduct.name}
                      </p>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                        <p className="text-gray-600">
                          DA {topRevenueProduct.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Aucune donnée disponible...</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Sales */}
            <Card className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
              <CardHeader>
                <CardTitle
                  className={`text-2xl font-semibold text-gray-800 ${montserrat.className}`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Ventes récentes
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Les 5 dernières ventes de votre magasin
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.length > 0 ? (
                    recentSales.map((sale) => (
                      <div key={sale.id} className="flex items-center">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium text-gray-800 leading-none">
                            {sale.buyerName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sale.productName} x {sale.quantity}
                          </p>
                        </div>
                        <div className="ml-auto text-right space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            DA {sale.totalPaid.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatRelativeTime(sale.date)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Aucune vente récente...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartDisplay({ data }: { data: SalesData[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#1f2937" // Couleur ajustée pour correspondre au style des autres pages
            strokeWidth="2px"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}