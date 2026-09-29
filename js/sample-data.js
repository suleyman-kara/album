/**
 * sample-data.js
 * Tek tıkla deneme ve önizleme için zengin örnek albüm verisi.
 * Gerçekçi hikayeler, kapak ve yüksek kaliteli optimize görseller içerir.
 */

const SampleAlbumData = {
  theme: 'vintage',
  orientation: 'landscape',
  cover: {
    title: 'Ege & Akdeniz Yolculuğu',
    subtitle: 'Masmavi Koylar, Tarihi Sokaklar ve Unutulmaz Anlar',
    date: 'Ağustos 2024',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  },
  backCover: {
    quote: '“Her yolculuk yeni bir başlangıç, her anı ömür boyu saklanacak bir hazinedir.”',
    author: 'Süleyman & Ailesi • 2024'
  },
  events: [
    {
      id: 'event-1',
      title: 'Kaş & Kaputaş’ın Büyüsü',
      date: '14 Ağustos 2024',
      location: 'Antalya, Kaş',
      paragraph: 'Sabahın ilk ışıklarında Kaputaş Plajı’nın turkuaz sularına indiğimiz anı unutmak imkansız. Kanyonun arasından süzülen rüzgar ve denizin dinginliği tüm yorgunluğumuzu aldı. Gün batımında Kaş’ın begonvillerle süslü dar sokaklarında yürürken hafif bir yasemin kokusu bize eşlik ediyordu.',
      photos: [
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 'event-2',
      title: 'Kelebekler Vadisi ve Ölüdeniz',
      date: '17 Ağustos 2024',
      location: 'Muğla, Fethiye',
      paragraph: 'Ölüdeniz’in gökyüzünde süzülen rengarenk yamaç paraşütlerini izledikten sonra tekneyle Kelebekler Vadisi’ne geçtik. Yüksek kayalıkların gölgesinde saklanan bu gizli cennet, doğanın sessizliğini ve ihtişamını bize tüm çıplaklığıyla hissettirdi. Akşam dalga sesleri eşliğinde kamp ateşi yaktık.',
      photos: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    {
      id: 'event-3',
      title: 'Adatepe & Kaz Dağları Keşfi',
      date: '21 Ağustos 2024',
      location: 'Çanakkale, Küçükkuyu',
      paragraph: 'Zeytin ağaçlarının arasından kıvrılan taş yollardan Adatepe Köyü’ne vardık. Asırlık çınar ağacının altında demlenen adaçayını yudumlarken zaman sanki durmuştu. Zeus Altarı’ndan Edremit Körfezi’ne baktığımızda gün batımı altın sarısı bir tül gibi denizin üzerine serilmişti.',
      photos: [
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  ]
};

window.SampleAlbumData = SampleAlbumData;
