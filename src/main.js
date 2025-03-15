const class_input = document.getElementById('class')

const send_button = document.getElementById('reward-btn')

function settingUI(data) {
    const firstText = document.getElementById('first_text')
    const secondText = document.getElementById('second_text')
    const thirdText = document.getElementById('third_text')
    const fourthText = document.getElementById('fourth_text')
    const fifthText = document.getElementById('fifth_text')
    const sixthText = document.getElementById('sixth_text')
    const sevenText = document.getElementById('seventh_text')
    firstText.textContent = `1교시. ${data[0].subject}`
    secondText.textContent = `2교시. ${data[1].subject}`
    thirdText.textContent = `3교시. ${data[2].subject}`
    fourthText.textContent = `4교시. ${data[3].subject}`
    fifthText.textContent = `5교시. ${data[4].subject}`
    sixthText.textContent = `6교시. ${data[5].subject}`
    if (data[6] && (data[6].subject != '')) {
        sevenText.textContent = `7교시. ${data[6].subject}`
    }
}

function getTodayDate() {
    const today = new Date();  // 오늘 날짜를 가져옵니다.
    
    const year = today.getFullYear();  // 연도 가져오기
    const month = String(today.getMonth() + 1).padStart(2, '0');  // 월 가져오기 (0부터 시작하므로 +1)
    const day = String(today.getDate()).padStart(2, '0');  // 일 가져오기
  
    return `${year}${month}${day}`;  // 형식: YYYYMMDD
  }

function sendData(message) {
    fetch('/send-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
        if ((! data) || (data == undefined)) {
            return
        }
        
        settingUI(data)
    })
    .catch(error => {
        console.log('에러 발생.')
    })
}

Kakao.init('8e36b99c5327ad8790e8cb2ef332761a')
console.log(`카카오 설치 상태 : ${Kakao.isInitialized()}`)

class_input.addEventListener('blur', function() {
    const inputed_class = Number(class_input.value)

    if (! inputed_class) {
        return
    }

    result = sendData({
        request_type: 'class_inputed',
        class_value: inputed_class
    })
})

send_button.addEventListener('click', function() {
    const defaultparams = {
        KEY: '39a646df3cf6484e93728f01c142b414',
        Type: 'json',
        pIndex: '1',
        pSize: '10'
    }

    const userparams = {
        ATPT_OFCDC_SC_CODE: 'E10',
        SD_SCHUL_CODE: '7310053',
        MLSV_YMD: String(Number(getTodayDate()) + 1)
    }

    const baseUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo'

    const params = new URLSearchParams({
        ...defaultparams,
        ...userparams
    }).toString();

    const finalUrl = `${baseUrl}?${params}`;

    fetch(finalUrl)  // JSON 파일이 있는 URL
    .then(response => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 정상적이지 않습니다.');
      }
      return response.json();  // JSON 형식으로 응답 본문을 파싱
    })
    .then(data => {
        const lunch = data.mealServiceDietInfo[1].row[0].DDISH_NM  // 받아온 JSON 데이터를 처리
        const dataMain = {
            first: {
                subject: document.getElementById('first_text').textContent,
                item: document.getElementById('first_item').value,
                notice: document.getElementById('first_notice').value
            },
            second: {
                subject: document.getElementById('second_text').textContent,
                item: document.getElementById('second_item').value,
                notice: document.getElementById('second_notice').value
            },
            third: {
                subject: document.getElementById('third_text').textContent,
                item: document.getElementById('third_item').value,
                notice: document.getElementById('third_notice').value
            },
            fourth: {
                subject: document.getElementById('fourth_text').textContent,
                item: document.getElementById('fourth_item').value,
                notice: document.getElementById('fourth_notice').value
            },
            fifth: {
                subject: document.getElementById('fifth_text').textContent,
                item: document.getElementById('fifth_item').value,
                notice: document.getElementById('fifth_notice').value
            },
            sixth: {
                subject: document.getElementById('sixth_text').textContent,
                item: document.getElementById('sixth_item').value,
                notice: document.getElementById('sixth_notice').value
            },
            seventh: {
                subject: document.getElementById('seventh_text').textContent,
                item: document.getElementById('seventh_item').value,
                notice: document.getElementById('seventh_notice').value
            },
            lunch : lunch.replace(/<br\s*\/?>/g, "\n"),
            noticeMain: document.getElementById('main_notice').value
        }
        let mainText = `<시간표>\n${dataMain.first.subject}(${(dataMain.first.notice==="" ? "정상수업" : dataMain.first.notice)})-${dataMain.first.item}\n${dataMain.second.subject}(${(dataMain.second.notice==="" ? "정상수업" : dataMain.second.notice)})-${dataMain.second.item}\n${dataMain.third.subject}(${(dataMain.third.notice==="" ? "정상수업" : dataMain.third.notice)})-${dataMain.third.item}\n${dataMain.fourth.subject}(${(dataMain.fourth.notice==="" ? "정상수업" : dataMain.fourth.notice)})-${dataMain.fourth.item}\n${dataMain.fifth.subject}(${(dataMain.fifth.notice==="" ? "정상수업" : dataMain.fifth.notice)})-${dataMain.fifth.item}\n${dataMain.sixth.subject}(${(dataMain.sixth.notice==="" ? "정상수업" : dataMain.sixth.notice)})-${dataMain.sixth.item}\n${dataMain.seventh.subject}(${dataMain.seventh.subject !== "7교시. " ? (dataMain.seventh.notice === "" ? "정상수업" : dataMain.seventh.notice) : ""})-${dataMain.seventh.item}\n \n<급식메뉴>\n${dataMain.lunch}\n \n<준비물 요약>\n과목별 교과서 및 필기구`
        
        if (dataMain.first.item != '') {
            mainText = `${mainText}, ${dataMain.first.item}`
        }
        if (dataMain.second.item != '') {
            mainText = `${mainText}, ${dataMain.second.item}`
        }
        if (dataMain.third.item != '') {
            mainText = `${mainText}, ${dataMain.third.item}`
        }
        if (dataMain.fourth.item != '') {
            mainText = `${mainText}, ${dataMain.fourth.item}`
        }
        if (dataMain.fifth.item != '') {
            mainText = `${mainText}, ${dataMain.fifth.item}`
        }
        if (dataMain.sixth.item != '') {
            mainText = `${mainText}, ${dataMain.sixth.item}`
        }
        if (dataMain.seventh.item != '') {
            mainText = `${mainText}, ${dataMain.seventh.item}`
        }

        mainText = `${mainText}\n \n<전달 사항>\n${dataMain.noticeMain}`


        Kakao.Share.sendDefault({
            objectType: 'text',
            text: mainText,
              
            link: {
              // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com',
            },
          });
    })
    .catch(error => {
      console.error('에러 발생:', error);
    });

    

    
})
