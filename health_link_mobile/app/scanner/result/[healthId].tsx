import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { getPatientByHealthId, ScanResultDTO } from '@/src/api/scan';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PatientResult() {
    const { healthId } = useLocalSearchParams();
    const router = useRouter();
    const [patient, setPatient] = useState<ScanResultDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (healthId) {
            fetchPatient();
        }
    }, [healthId]);

    const fetchPatient = async () => {
        try {
            const data = await getPatientByHealthId(healthId as string);
            setPatient(data);
        } catch (err) {
            setError('Could not fetch patient details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Fetching Records...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle" size={60} color="#dc3545" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.btn}>
                    <Text style={styles.btnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/patient/dashboard')} style={styles.closeBtn}>
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.profileImageContainer}>
                    {patient?.profileImage ? (
                        <Image source={{ uri: patient.profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={[styles.profileImage, styles.placeholderImage]}>
                            <Ionicons name="person" size={50} color="#ccc" />
                        </View>
                    )}
                </View>
                {/* <Text style={styles.name}>{healthId}</Text> */}
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.statGrid}>
                    <StatBox label="Blood Type" value={patient?.bloodGroup || 'N/A'} icon="water" color="#ef4444" />
                    <StatBox label="Height" value={patient?.height ? `${patient.height} cm` : 'N/A'} icon="resize" color="#3b82f6" />
                    <StatBox label="Weight" value={patient?.weight ? `${patient.weight} kg` : 'N/A'} icon="barbell" color="#10b981" />
                    <StatBox label="Gender" value={patient?.gender || 'N/A'} icon="male-female" color="#8b5cf6" />
                </View>

                <Section title="Emergency Contact">
                    <View style={styles.emergencyBox}>
                        <Ionicons name="call" size={24} color="#dc2626" />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.emergencyName}>{patient?.guardianName || 'Guardian'}</Text>
                            <Text style={styles.emergencyNumber}>{patient?.guardianContact || 'N/A'}</Text>
                        </View>
                    </View>
                </Section>

                {patient?.allergies && patient.allergies.length > 0 && (
                    <Section title="Allergies">
                        <View style={styles.chipContainer}>
                            {patient.allergies.map((allergy, index) => (
                                <View key={index} style={styles.chip}>
                                    <Text style={styles.chipText}>{allergy}</Text>
                                </View>
                            ))}
                        </View>
                    </Section>
                )}
                <Section title="Identity Verification">
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>NIC:</Text>
                        <Text style={styles.value}>{patient?.nic || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Date of Birth:</Text>
                        <Text style={styles.value}>{patient?.dob || 'N/A'}</Text>
                    </View>
                </Section>
            </View>
        </ScrollView>
    );
}

const StatBox = ({ label, value, icon, color }: any) => (
    <View style={styles.statBox}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const Section = ({ title, children }: any) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    errorText: { marginTop: 10, fontSize: 16, color: '#dc3545', textAlign: 'center', marginBottom: 20 },
    header: { padding: 20, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    closeBtn: { position: 'absolute', top: 50, right: 20 },
    profileImageContainer: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: 'white' },
    placeholderImage: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 10 },
    content: { padding: 20 },
    statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    statBox: { width: '48%', backgroundColor: 'white', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    statValue: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
    statLabel: { fontSize: 12, color: '#64748b' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    emergencyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },
    emergencyName: { fontSize: 16, fontWeight: 'bold', color: '#991b1b' },
    emergencyNumber: { fontSize: 14, color: '#b91c1c' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    chipText: { color: '#991b1b', fontWeight: '500' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    label: { color: '#64748b', fontSize: 15 },
    value: { fontWeight: '600', color: '#334155', fontSize: 15 },
    btn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
    btnText: { color: 'white' },
});
