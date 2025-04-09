"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart2, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Bell, 
  Briefcase,
  Package,
  Menu,
  X
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Détecter si l'écran est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Information de l'administrateur
  const adminInfo = {
    name: "Admin",
    email: "admin@example.com",
    photoUrl: null // null pour utiliser l'icône par défaut
  };
  
  const navItems = [
    { name: "Tableau de bord", href: "/admin/dashboard", icon: BarChart2 },
    { name: "Gestion", href: "/admin/gestion", icon: Briefcase },
    { name: "Boutique", href: "/admin/boutique", icon: ShoppingBag },
    { name: "Ventes", href: "/admin/ventes", icon: DollarSign },
    { name: "Commandes", href: "/admin/commandes", icon: Package },
    { name: "Signalements", href: "/admin/signalements", icon: ShieldAlert },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Paramètres", href: "/admin/parametres", icon: Settings },
  ];
  
  // Fonction pour gérer le clic sur la sidebar - fonctionne pour PC et mobile
  const handleSidebarClick = (e) => {
    // Vérifie si le clic n'est pas sur un élément de navigation ou un bouton
    if (!e.target.closest('a') && !e.target.closest('button')) {
      if (isMobile) {
        setIsMobileMenuOpen(false);
      } else {
        setIsCollapsed(!isCollapsed);
      }
    }
  };
  
  // Fermer le menu mobile lors d'un clic sur un lien
  const handleNavItemClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };
  
  // Bouton pour le menu mobile
  const MobileMenuButton = () => (
    <button 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
      aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Bouton menu mobile */}
      {isMobile && <MobileMenuButton />}
      
      {/* Overlay pour mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-full transition-all duration-300 flex flex-col shadow-lg z-50 border-r border-gray-200 bg-white fixed cursor-pointer
                    ${isMobile 
                      ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
                      : `${isCollapsed ? "w-20" : "w-64"}`}`
                    }
        onClick={handleSidebarClick}
      >
        {/* Profil Admin */}
        <div className={`p-4 flex flex-col items-center border-b border-gray-200 pb-6`}>
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center overflow-hidden mb-2">
            {adminInfo.photoUrl ? (
              <img src={adminInfo.photoUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <Users className="h-8 w-8 text-white" />
            )}
          </div>
          
          {(!isCollapsed || isMobile) && (
            <>
              <h3 className={`${montserrat.className} text-base font-bold text-gray-900 mt-2`}>
                {adminInfo.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{adminInfo.email}</p>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavItemClick}
                className={`flex items-center gap-4 py-3 px-6 ${
                  isActive
                    ? "bg-gray-100 text-black border-r-4 border-black font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? "text-black" : "text-gray-500"}`}
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bouton de déconnexion - toujours visible */}
        <div className="p-4 border-t border-gray-200">
          <button
            className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : "gap-4"} py-3 ${isCollapsed && !isMobile ? "px-2" : "px-6"} w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg`}
          >
            <LogOut className="h-5 w-5" />
            {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
      
      {/* Contenu principal en pleine largeur */}
      <div className={`w-full transition-all duration-300 h-screen overflow-auto
                      ${isMobile 
                        ? 'ml-0' 
                        : `${isCollapsed ? "ml-20" : "ml-64"}`}`
                      }
      >
        {children}
      </div>
    </div>
  );
}