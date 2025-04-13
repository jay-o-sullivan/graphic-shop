const express = require('express');
const router = express.Router();

// Get about page
router.get('/', (req, res) => {
  // Team members data
  const team = [
    {
      name: 'John Doe',
      position: 'Creative Director',
      bio: 'John has over 15 years of experience in graphic design and branding.',
      imageUrl: '/images/team/john-doe.jpg'
    },
    {
      name: 'Jane Smith',
      position: 'Senior Designer',
      bio: 'Jane specializes in logo design and visual identity systems.',
      imageUrl: '/images/team/jane-smith.jpg'
    },
    {
      name: 'Mike Johnson',
      position: 'Web Designer',
      bio: 'Mike creates engaging digital experiences with a focus on usability.',
      imageUrl: '/images/team/mike-johnson.jpg'
    }
  ];

  // Company history
  const history = [
    {
      year: 2018,
      title: 'Founded',
      description: 'GraphicShop was established to provide quality design services to small businesses.'
    },
    {
      year: 2020,
      title: 'Expansion',
      description: 'We doubled our team size and expanded our service offerings.'
    },
    {
      year: 2022,
      title: 'Global Reach',
      description: 'Started serving clients internationally with a focus on digital services.'
    }
  ];

  res.render('about', {
    title: 'About Us - GraphicShop',
    team,
    history,
    activePage: 'about'
  });
});

module.exports = router;
