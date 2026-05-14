import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import BottomNav from './BottomNav';
import { lotService } from '../services/lotService';

const STATUS_TABS = ['Tous', 'Reçu', 'En transit', 'Traité', 'Exporté'];

export default function LotsScreen({ navigation, currentRoute }: any) {
    const [lots, setLots] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [refreshing, setRefreshing] = useState(false);

    const activeTab = currentRoute === 'Lots' ? 'lots' : currentRoute === 'Alerts' ? 'alerts' : 'profile';

    useEffect(() => { loadLots(); }, []);
    useEffect(() => { filterLots(); }, [activeFilter, lots]);

    const loadLots = async () => {
        try { const data = await lotService.getAll(); setLots(data || []); } catch (e) { }
    };

    const filterLots = () => {
        if (activeFilter === 'Tous') { setFiltered(lots); return; }
        const map: Record<string, string> = { 'Reçu': 'recu', 'En transit': 'en_transfert', 'Traité': 'traite', 'Exporté': 'exporte' };
        setFiltered(lots.filter(l => l.statut === map[activeFilter]));
    };

    const handleTabPress = (tab: string) => {
        if (tab === 'home') navigation.navigate('Home');
        else if (tab === 'alerts') navigation.navigate('Alerts');
        else if (tab === 'profile') navigation.navigate('Profile');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lots</Text>
                <Text style={styles.headerCount}>{lots.length} lots</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
                {STATUS_TABS.map((tab) => (
                    <TouchableOpacity key={tab} style={[styles.chip, activeFilter === tab && styles.chipActive]} onPress={() => setActiveFilter(tab)}>
                        <Text style={[styles.chipText, activeFilter === tab && styles.chipTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadLots(); setRefreshing(false); }} tintColor={Colors.accent} />}>
                {filtered.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Aucun lot trouvé</Text>
                    </View>
                ) : (
                    filtered.map((lot) => (
                        <TouchableOpacity key={lot.id} style={styles.card} onPress={() => navigation.navigate('LotDetail', { lot })} activeOpacity={0.7}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardId}>#{lot.id?.slice(0, 8)}</Text>
                                <View style={[styles.badge, { backgroundColor: statusColor(lot.statut) + '25' }]}>
                                    <Text style={[styles.badgeText, { color: statusColor(lot.statut) }]}>{statusLabel(lot.statut)}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardName}>{lot.producteurName}</Text>
                            <Text style={styles.cardDetail}>{lot.poidsRecu} kg · {lot.espece} · {lot.region}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
    );
}

function statusLabel(s: string) { return { recu: 'Reçu', en_transfert: 'En transit', traite: 'Traité', exporte: 'Exporté' }[s] || s; }
function statusColor(s: string) { return { recu: Colors.info, en_transfert: Colors.warning, traite: Colors.accent, exporte: Colors.success }[s] || Colors.textMuted; }

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl + Spacing.sm, paddingBottom: Spacing.md },
    headerTitle: { fontFamily: 'serif', fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
    headerCount: { fontSize: FontSize.sm, color: Colors.textMuted },
    filterRow: { maxHeight: 52, backgroundColor: Colors.darkLight, borderBottomWidth: 1, borderBottomColor: Colors.border },
    filterContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm, alignItems: 'center' },
    chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.darkInput },
    chipActive: { backgroundColor: Colors.accent },
    chipText: { fontSize: FontSize.sm, color: Colors.textMuted },
    chipTextActive: { color: Colors.dark, fontWeight: '600' },
    scroll: { flex: 1 },
    scrollContent: { padding: Spacing.lg },
    card: { backgroundColor: Colors.darkCard, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    cardId: { fontFamily: 'monospace', fontSize: FontSize.sm, color: Colors.textMuted },
    badge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
    badgeText: { fontSize: FontSize.xs, fontWeight: '600' },
    cardName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
    cardDetail: { fontSize: FontSize.sm, color: Colors.textSecondary },
    empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
    emptyText: { fontSize: FontSize.lg, color: Colors.textMuted },
});