import { useEffect, useState } from "react"
import Apis, { endpoints } from "../../configs/Apis";
import { FlatList, View, Image, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator, Chip, List, Searchbar } from "react-native-paper";
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState();
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);


    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories'])
        setCategories(res.data);
    }

    const loadCourses = async () => {
        if (page > 0) {
            try {
                setLoading(true)

                let url = `${endpoints['courses']}?page=${page}`;

                if (q) {
                    url = `${url}&q=${q}`;
                }

                if (cateId) {
                    url = `${url}&category_id=${q}`
                }


                let res = await Apis.get(url)
                setCourses([...courses, ...res.data.results]);

                if (res.next === null)
                    setPage(0);
            } catch {

            } finally {
                setLoading(false)
            }
        }
    }

    const loadMore = () => {
        if (!loading && page > 0)
            setPage(page + 1)
    }

    useEffect(() => {
        loadCates();
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => {
            loadCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, page, cateId]);

    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.p]}>
            <Text style={MyStyles.subject}>DANH SACH KHOA HOC</Text>

            <View style={[MyStyles.row, MyStyles.wrap]}>
                <TouchableOpacity onPress={() => setCateId(null)}>
                    <Chip icon="label" style={MyStyles.m}>All</Chip>
                </TouchableOpacity>

                {categories.map(c => <TouchableOpacity key={c.id} onPress={() => setCateId(c.id)}>
                    <Chip icon="label" style={MyStyles.m}>{c.name}</Chip>
                </TouchableOpacity>)}
            </View>

            <Searchbar
                placeholder="Search"
                onChangeText={setQ}
                value={q}
            />

            <FlatList onEndReached={loadMore} ListFooterComponent={loading && <ActivityIndicator />} data={courses} renderItem={({ item }) => <List.Item title={item.subject} description={item.created_date} left={() => <Image style={MyStyles.avatar} source={{ uri: item.image }} />} />} />
        </SafeAreaView>
    );
}

export default Home;