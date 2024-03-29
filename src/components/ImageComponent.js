import {Text,View, Button, StyleSheet, Dimensions, StatusBar,TouchableOpacity,Image } from 'react-native';
import { ImageGallery, Header} from '@georstat/react-native-image-gallery';
import {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getImageUrls } from '../../api/http';
import moment from "moment";
import {ImageCache} from "../utils/cache"
import GridImageViewerCaption from '../components/UI/GridImageViewerCaption';
import { useQueryClient, useQueries } from 'react-query';
function ImageComponent({questionIdRes, cachedImages, imageResponses, questionId,physicianId}){
    // console.error(questionIdRes)
    const [images, setImages] = useState([]);
    const queryClient = useQueryClient();
    let temp = []
    const[isLoading, setIsLoading] = useState(true);
    const[isRefetching, setIsRefetching] = useState(true);
    const[isRefetched, setRefetched] = useState(false);

    


    // const res = useQueries(
        
    //   imageResponses.map( res  => {
    //              return {
    //               queryKey: Object.keys(res)[0],
    //               queryFn: () => getImageUrls(Object.values(res)[0]),
    //               staleTime: 780000
    //           }
    //   })
    // )
    // console.error("fsdfdfds")

    // console.error(res)
    // for(const d of data){
    //   console.error(d[1].data)
    // }
    // const getImageUrls = async (imageKey, userResponse, index) => {
    //     const res = await getImageUrl(imageKey)
    //     // console.error(userResponse);
        
    //     if (res){
    //         let t = {}
    //         // t['id'] = imageKey;
    //         t['image'] = res['data']['image_url']
    //         t['text'] = moment(userResponse['timestamp']).utc(userResponse['timestamp']).local().format('MMM Do YY')
    //         t['timestamp'] = userResponse['timestamp']
    //         // temp.push(res['data']['image_url'])
    //         temp.push(t)
           
    //         if( index == questionIdRes.length - 1){
    //           // if this is the last response
    //           // sort the responses now by time (asc order)
    //           var sortedByTime= temp.sort((function (a, b) { 
    //             return  moment(a['timestamp']).diff(moment(b['timestamp']))
    //           }));
    //           setImages(sortedByTime)
    //           await ImageCache.set(`${physicianId}_${questionId}`, sortedByTime )
              
    //           // await ImageCache.clearAll();
    //         }
    //         return true;
    //      } else{
    //         return false;
    //      }
        
    // }
    const refetchImageResponses = async () => {
      // setIsLoading(true)
    
       const refetchQueries = await queryClient.refetchQueries({queryKey: `${physicianId}-${questionId}`})
       setIsRefetching(true);
       setIsLoading(true)
       console.error(`${physicianId}-${questionId}`)


        if(refetchQueries != undefined){
          let temp = []
          refetchQueries[0][1].forEach( d => {
            //  setImages([...images, d.data.image_url])
            //  setImages(curr => [...curr, d.data.image_url])
            temp.push({image: d.data.image_url})
            
            })
            setImages(temp)
        }
      setIsLoading(false)
      setIsRefetching(false);
      setRefetched(true);



    }
    const  processResponses = async () => {
      const data = queryClient.getQueriesData({queryKey: `${physicianId}-${questionId}`})
        let temp = []
        data[0][1].forEach( d => {
        //  setImages([...images, d.data.image_url])
        //  setImages(curr => [...curr, d.data.image_url])
        temp.push({
          image: d.data.image_url,
          text: moment(d.data.timestamp).utc(d.data.timestamp).local().format('MMM Do YY'),
          timestamp: d.data.timestamp
        })
        
        })

        var sortedByTime= temp.sort((function (a, b) { 
          return  moment(a['timestamp']).diff(moment(b['timestamp']))
        }));
        setImages(sortedByTime)

      
        // const cachedImages = await ImageCache.get(`${physicianId}_${questionId}`)
        // // await ImageCache.clearAll();
        // if(cachedImages !== undefined && cachedImages.length > 0){
        //     console.error("cached")
        //     // console.error(cachedImages.length)
        //     setImages(cachedImages)
        //     setIsLoading(false)

        // } else {
        //     for(var i = 0 ; i < questionIdRes.length; ++i){
        //         const res = await getImageUrls(questionIdRes[i]['value'], questionIdRes[i], i);
        //         if(res && i == questionIdRes.length-1){ 
         setIsLoading(false)
         setIsRefetching(false)

        
        //         } 
        //     }
        // }
    }
    useEffect(() => {
        processResponses();
    }, [])
  //   useEffect(() => {
  //     processResponses();
  // }, [cachedImages[0].isStale && cachedImages[0].isRefetching])
  

      const renderHeaderComponent = (image, currentIndex) => {

        return (
            <SafeAreaView style={{flex: 1}}> 
            <View style={styles.container}>
                 <Text style={{color: 'white'}}> Time: {image['timestamp']}</Text>
            </View>
                 
            </SafeAreaView>
        );
      }
      const [isOpen, setIsOpen] = useState(false);
      const openGallery = () => setIsOpen(true);
      const closeGallery = () => setIsOpen(false);
      
      return (
          < >
              {isLoading &&  processResponses() && <Text>Loading...</Text>}
              
              {/* {cachedImages[0].isStale==true && !isRefetched && refetchImageResponses() && <Text>Refetching...</Text>} */}
              { !isLoading &&
                // <View style={styles.screen}>
                //     {/* <TouchableOpacity style={styles.commandButton} onPress={openGallery}>
                //         <Text style={styles.panelButtonTitle}>{'View Responses'}</Text>
                //     </TouchableOpacity> */}
                //     {console.error(images)}
                //     {/* <ImageGallery close={closeGallery} isOpen={isOpen} images={images}
                //     renderHeaderComponent={renderHeaderComponent}
                //     resizeMode="contain"
                //     /> */}
                //      <GridImageView data={['https://i.picsum.photos/id/1076/200/300.jpg?hmac=v-yXySfuFZmvrYNvyAps4V02kbxa1_XuprgoVVsj4ZQ', 'https://i.picsum.photos/id/569/200/200.jpg?hmac=rzX0dRJRyZs2NIa_h_87CJVeoetRLtTlweCZmYrYlCA']} />
                // </View>
                <View style={styles.background}>
                <Text style={styles.explore_text}>
                  {/* Click on an image to view in full screen mode */}
                </Text>
          {/* {console.error(images.length)} */}
                {/* Basic Usage */}
                {/* <GridImageView data={images} transparent={0.8}  /> */}
                {images.length !== 0 ?  <GridImageViewerCaption data={ images} captionColor="#fff" /> : <Text>No Data Available</Text>}
               
              </View>
              }
          </>
      )
}
export default ImageComponent;

const styles = StyleSheet.create({
    background: {
        // backgroundColor: 'black',
        flex: 1,
      },
      headline_text: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 20,
      },
      explore_text: {
        marginTop: 5,
        marginBottom: 10,
        color: 'white',
        marginLeft: 20,
        fontSize: 12,
        fontWeight: '600',
      },
    container:{
        alignItems: 'top',
        backgroundColor: 'black',
        flexDirection: 'row',
        height: 52,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: 45
    },
    commandButton: {
        padding: 12,
        borderRadius: 15,
        backgroundColor: '#0d58d1',
        alignItems: 'center',
        marginTop: 12,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
    screen: {
        // alignItems: 'center',
        flex: 1,
        // justifyContent: 'center',
      },
      customImageContainer: {
        alignItems: 'center',
        borderRadius: 11,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 24,
        width: '100%',
      },
      customImage: {
        borderColor: 'green',
        borderRadius: 250,
        borderWidth: 3,
        height: 300,
        overflow: 'hidden',
        width: 300,
      },

})