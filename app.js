const express = require('express');
const path = require('path');
const Timetable = require('comcigan-parser');
const { request } = require('http');
const timetable = new Timetable

function getDay() {
    // 한국 표준시(KST) 기준으로 오늘의 요일을 숫자로 가져오기
    const date = new Date();

    // 한국 표준시(KST) 기준으로 날짜를 변환
    const options = { timeZone: 'Asia/Seoul' };
    const kstDate = new Intl.DateTimeFormat('ko-KR', options).format(date);

    // KST 기준으로 요일 숫자 가져오기
    const dayOfWeek = new Date(kstDate).getDay();

    return dayOfWeek;
}

timetable.init().then(()=>{
    // 초기화 완료
});

const app = express()
const port = 3000

// 'public' 폴더를 정적 파일 폴더로 설정
app.use(express.static(path.join(__dirname, 'public')))

// 'src' 폴더를 정적 파일 폴더로 설정
app.use(express.static(path.join(__dirname, 'src')))

// '/' 디렉토리로 접근시 denied.html 반환
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'denied.html'))
})

// json 형식의 신호 수신을 위한 미들 웨어
app.use(express.json())

// post 요청 처리 라우트
app.post('/send-data', (req, res) => {
    const {request_type, class_value} = req.body;
    
    if (request_type == 'class_inputed') {
        if (! class_value) {
            return
        }

        timetable.init().then(()=>{
            // 초기화 완료
        });

        timetable.search('연수고').then((schoolList) => {
            const MySchool = schoolList.find((school) => {
                return school.region === '인천' && school.name === '연수고등학교';
            })

            if (! MySchool) {
                //학교를 찾을 수 없음.
                return
            }

            timetable.setSchool(MySchool.code)

            timetable.getTimetable().then((result) => {
                const day = getDay()

                const mainClass = result[1][class_value]
                
                if (! mainClass) {
                    return
                }

                const main = mainClass[day]
                
                res.json(main)
            })
        })
    }
})

// '/main' 디렉토리로 접근시 main.html 반환
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'))
})

// 포트 오픈
app.listen(port, () => {
    console.log(`Server Started. Listening the port ${port}`)
})