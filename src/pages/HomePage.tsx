/**
 * Home Page Component
 * 
 * Landing page for the CareSync mental health platform.
 * Features hero section, key benefits, and call-to-action buttons.
 * 
 * Features:
 * - Responsive hero section
 * - Multi-language support
 * - Call-to-action buttons
 * - Modern design with animations
 * - Accessibility features
 * 
 * Author: CareSync Development Team
 * Version: 1.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Users, Shield, MessageCircle, ArrowRight } from 'lucide-react'

/**
 * Home page component
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                CareSync
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-gray-700">
                בריאות נפשית לכולם
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              פלטפורמה מקיפה המחברת בין מטופלים למטפלים מוסמכים בישראל.
              מצא את המטפל המתאים עבורך או הצטרף כמומחה מקצועי.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/therapists"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                מצא מטפל
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                הצטרף כמומחה
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              למה לבחור ב-CareSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              פלטפורמה בטוחה ואמינה המחברת בין מטופלים למטפלים מוסמכים
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              הצטרפו לקהילה שלנו וקבלו את התמיכה הנפשית שאתם זקוקים לה
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                התחל עכשיו
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/therapists"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                גלה מטפלים
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Features data
const features = [
  {
    icon: Shield,
    title: 'בטוח ואמין',
    description: 'כל המטפלים מוסמכים ומאומתים עם רישיון מקצועי'
  },
  {
    icon: Users,
    title: 'קהילה תומכת',
    description: 'קהילה של מטופלים ומטפלים המחויבים לבריאות נפשית'
  },
  {
    icon: MessageCircle,
    title: 'תקשורת ישירה',
    description: 'צור קשר ישיר עם המטפל המתאים עבורך'
  },
  {
    icon: Heart,
    title: 'טיפול מותאם אישית',
    description: 'מצא את המטפל המתאים לצרכים הספציפיים שלך'
  }
]

export default HomePage 