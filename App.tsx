import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type Page = "home" | "about" | "faq" | "contact" | "privacy" | "checkout" | "thanks";

type MenuItem = {
  key: Exclude<Page, "thanks">;
  label: string;
};

type PaymentMethod = "iDEAL" | "Kaart" | "PayPal";
type Country = "Nederland" | "Belgie" | "Anders";

const MENU_ITEMS: MenuItem[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "Over ons" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
  { key: "privacy", label: "Privacy" },
  { key: "checkout", label: "Checkout" },
];

const PAYMENT_METHODS: PaymentMethod[] = ["iDEAL", "Kaart", "PayPal"];
const COUNTRIES: Country[] = ["Nederland", "Belgie", "Anders"];
const DOWNLOAD_URL = "https://example.com/focuskracht.pdf";

const QUICK_CARDS = [
  {
    icon: "🧩",
    title: "Korte hoofdstukken",
    text: "1 idee per blok, zodat je aandacht niet overbelast raakt.",
  },
  {
    icon: "🧭",
    title: "Duidelijke structuur",
    text: "Rustige volgorde en heldere koppen zonder ruis.",
  },
  {
    icon: "⚡",
    title: "Actie in 5 minuten",
    text: "Direct toepasbare stappen met snel resultaat.",
  },
];

const TESTIMONIALS = [
  "Eindelijk kort en duidelijk. Ik kon direct starten.",
  "De checklists werken top als mijn hoofd vol zit.",
  "Van kopen naar toepassen in dezelfde dag.",
];

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 940;

  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [country, setCountry] = useState<Country>("Nederland");
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("iDEAL");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [thanksMethod, setThanksMethod] = useState<PaymentMethod>("iDEAL");
  const [thanksExpress, setThanksExpress] = useState(false);
  const [thanksName, setThanksName] = useState("");

  const subtitle = useMemo(() => {
    if (currentPage === "thanks") {
      const safeName = thanksName.trim();
      const prefix = safeName ? `${safeName}, ` : "";
      return thanksExpress
        ? `${prefix}je hebt gekozen voor express checkout met ${thanksMethod}.`
        : `${prefix}je betaling met ${thanksMethod} is gelukt.`;
    }

    return "";
  }, [currentPage, thanksExpress, thanksMethod, thanksName]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const openCheckout = () => navigate("checkout");

  const completeOrder = (express: boolean) => {
    const finalName = express ? "Express koper" : checkoutName.trim();
    const finalEmail = express ? "" : checkoutEmail.trim();

    if (!express) {
      if (!finalName || !finalEmail.includes("@")) {
        Alert.alert("Controleer je gegevens", "Vul een naam en geldig e-mailadres in.");
        return;
      }
    }

    setThanksExpress(express);
    setThanksMethod(paymentMethod);
    setThanksName(finalName);
    navigate("thanks");
  };

  const sendContact = async () => {
    const safeName = contactName.trim();
    const safeEmail = contactEmail.trim();
    const safeMessage = contactMessage.trim();

    if (!safeName || !safeEmail.includes("@") || !safeMessage) {
      Alert.alert("Formulier onvolledig", "Vul naam, e-mail en bericht in.");
      return;
    }

    const subject = encodeURIComponent("Contact via Focuskracht app");
    const body = encodeURIComponent(
      `Naam: ${safeName}\nE-mail: ${safeEmail}\n\nBericht:\n${safeMessage}`,
    );
    const mailTo = `mailto:info@focuskracht.nl?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(mailTo);
    if (!canOpen) {
      Alert.alert("Mail niet beschikbaar", "Open handmatig: info@focuskracht.nl");
      return;
    }

    await Linking.openURL(mailTo);
  };

  const openDownload = async () => {
    const canOpen = await Linking.canOpenURL(DOWNLOAD_URL);
    if (!canOpen) {
      Alert.alert("Downloadlink", "Vervang DOWNLOAD_URL in App.tsx door je echte PDF link.");
      return;
    }
    await Linking.openURL(DOWNLOAD_URL);
  };

  const sectionWidthStyle = isWide ? styles.sectionWide : styles.sectionNarrow;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5fbff" />

      <View style={styles.header}>
        <Pressable style={styles.brand} onPress={() => navigate("home")}>
          <View style={styles.brandMark} />
          <Text style={styles.brandText}>Focuskracht</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Open menu"
          style={styles.menuButton}
          onPress={() => setMenuOpen(true)}
        >
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.pageWrap, sectionWidthStyle]}>{renderPage()}</View>
        <Footer onNavigate={navigate} />
      </ScrollView>

      <View style={styles.floatingBar}>
        <Text style={styles.floatingTitle}>Focuskracht €19</Text>
        <Pressable style={styles.primaryButton} onPress={openCheckout}>
          <Text style={styles.primaryButtonText}>Direct kopen</Text>
        </Pressable>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.menuLayer}>
          <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuSheet}>
            <Text style={styles.menuTitle}>Menu</Text>
            {MENU_ITEMS.map((item) => {
              const active = currentPage === item.key;
              return (
                <Pressable
                  key={item.key}
                  style={[styles.menuItem, active && styles.menuItemActive]}
                  onPress={() => navigate(item.key)}
                >
                  <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  function renderPage() {
    switch (currentPage) {
      case "home":
        return (
          <>
            <View style={[styles.heroWrap, isWide && styles.heroWrapWide]}>
              <View style={styles.heroCopy}>
                <Text style={styles.eyebrow}>ADHD-proof webshop</Text>
                <Text style={styles.heroTitle}>Meer rust, meer focus, sneller starten</Text>
                <Text style={styles.heroText}>
                  Focuskracht is een praktisch e-book met korte stappen en duidelijke actiepunten.
                  Geen overload, wel directe toepasbaarheid.
                </Text>

                <View style={styles.actionRow}>
                  <Pressable style={styles.primaryButton} onPress={openCheckout}>
                    <Text style={styles.primaryButtonText}>Koop direct voor €19</Text>
                  </Pressable>
                  <Pressable style={styles.secondaryButton} onPress={() => navigate("about")}>
                    <Text style={styles.secondaryButtonText}>Bekijk meer</Text>
                  </Pressable>
                </View>

                <View style={styles.trustGrid}>
                  <TrustChip text="2 minuten checkout" icon="⚡" />
                  <TrustChip text="Directe download" icon="📥" />
                  <TrustChip text="ADHD-vriendelijk" icon="🧠" />
                </View>
              </View>

              <View style={styles.heroCard}>
                <Text style={styles.pill}>E-book</Text>
                <Text style={styles.cardTitle}>Focuskracht</Text>
                <Text style={styles.cardText}>
                  76 pagina's met routines, checklists en een 7-daagse reset om impuls om te zetten
                  naar actie.
                </Text>
                <Pressable style={styles.primaryButton} onPress={openCheckout}>
                  <Text style={styles.primaryButtonText}>Nu bestellen</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
              {QUICK_CARDS.map((card) => (
                <View key={card.title} style={styles.infoCard}>
                  <Text style={styles.infoIcon}>{card.icon}</Text>
                  <Text style={styles.infoTitle}>{card.title}</Text>
                  <Text style={styles.infoText}>{card.text}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.productWrap, isWide && styles.productWrapWide]}>
              <Pressable style={styles.productCard} onPress={openCheckout}>
                <Text style={styles.pill}>Bestseller</Text>
                <Text style={styles.productTitle}>Focuskracht ADHD E-book</Text>
                <Text style={styles.productText}>
                  Praktische methodes voor focus, planning, impulscontrole en energiemanagement.
                </Text>
                <View style={styles.bulletList}>
                  <Text style={styles.bullet}>• 76 pagina's met visuele samenvattingen</Text>
                  <Text style={styles.bullet}>• Printbare weekplanner en noodchecklist</Text>
                  <Text style={styles.bullet}>• Bonus: 7 dagen reset-schema</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>€19 eenmalig</Text>
                  <Text style={styles.inlineCta}>Bestel direct</Text>
                </View>
              </Pressable>

              <View style={styles.stepsCard}>
                <Text style={styles.stepsTitle}>Zo simpel is bestellen</Text>
                <Text style={styles.step}>1. Klik op bestel direct</Text>
                <Text style={styles.step}>2. Kies je betaalmethode</Text>
                <Text style={styles.step}>3. Download direct na betaling</Text>
                <Pressable style={styles.secondaryButton} onPress={openCheckout}>
                  <Text style={styles.secondaryButtonText}>Naar checkout</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.testimonialRow, isWide && styles.testimonialRowWide]}>
              {TESTIMONIALS.map((quote) => (
                <View key={quote} style={styles.quoteCard}>
                  <Text style={styles.quote}>"{quote}"</Text>
                </View>
              ))}
            </View>

            <View style={styles.banner}>
              <View>
                <Text style={styles.eyebrow}>Vasthouden van momentum</Text>
                <Text style={styles.bannerTitle}>Pak je focus nu, niet later</Text>
              </View>
              <Pressable style={styles.primaryButton} onPress={openCheckout}>
                <Text style={styles.primaryButtonText}>Koop nu voor €19</Text>
              </Pressable>
            </View>
          </>
        );

      case "about":
        return (
          <>
            <Text style={styles.eyebrow}>Over ons</Text>
            <Text style={styles.pageTitle}>Gebouwd voor mensen die snel afgeleid raken</Text>
            <Text style={styles.pageLead}>
              Focuskracht combineert gedragspsychologie met praktische ADHD-coaching in korte,
              scan-vriendelijke blokken.
            </Text>

            <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Waarom Focuskracht?</Text>
                <Text style={styles.pageCardText}>Veel content is te lang en te abstract.</Text>
                <Text style={styles.bullet}>• Korte hoofdstukken</Text>
                <Text style={styles.bullet}>• Één hoofdactie per onderdeel</Text>
                <Text style={styles.bullet}>• Visueel ritme voor aandacht</Text>
              </View>

              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Onze aanpak</Text>
                <Text style={styles.pageCardText}>
                  We minimaliseren keuzestress en maken direct starten zo makkelijk mogelijk.
                </Text>
                <Text style={styles.bullet}>• Duidelijke knoppen met hoog contrast</Text>
                <Text style={styles.bullet}>• Snelle checkoutflow</Text>
                <Text style={styles.bullet}>• Focus op doen, niet twijfelen</Text>
              </View>
            </View>

            <View style={styles.banner}>
              <View>
                <Text style={styles.eyebrow}>Klaar om te starten?</Text>
                <Text style={styles.bannerTitle}>Bestel vandaag en begin meteen</Text>
              </View>
              <Pressable style={styles.primaryButton} onPress={openCheckout}>
                <Text style={styles.primaryButtonText}>Naar checkout</Text>
              </Pressable>
            </View>
          </>
        );

      case "faq":
        return (
          <>
            <Text style={styles.eyebrow}>FAQ</Text>
            <Text style={styles.pageTitle}>Snel antwoord op je vragen</Text>
            <Text style={styles.pageLead}>Kort en duidelijk zodat je direct verder kunt.</Text>

            <View style={styles.stackGap}>
              <FaqCard
                question="Hoe ontvang ik het e-book?"
                answer="Direct na betaling zie je de downloadknop en ontvang je een e-mail."
              />
              <FaqCard
                question="Welke betaalmethodes zijn er?"
                answer="iDEAL, kaart en PayPal."
              />
              <FaqCard
                question="Is het geschikt voor volwassenen met ADHD?"
                answer="Ja, de inhoud is primair voor volwassenen en studenten gemaakt."
              />
              <FaqCard
                question="Kan ik op mobiel lezen?"
                answer="Ja, het bestand werkt op telefoon, tablet en laptop."
              />
              <FaqCard
                question="Wat als downloaden mislukt?"
                answer="Stuur een bericht via contact; je krijgt snel een nieuwe link."
              />
            </View>

            <View style={styles.banner}>
              <View>
                <Text style={styles.eyebrow}>Geen twijfel meer</Text>
                <Text style={styles.bannerTitle}>Klik door en rond je aankoop af</Text>
              </View>
              <Pressable style={styles.primaryButton} onPress={openCheckout}>
                <Text style={styles.primaryButtonText}>Bestel nu</Text>
              </Pressable>
            </View>
          </>
        );

      case "contact":
        return (
          <>
            <Text style={styles.eyebrow}>Contact</Text>
            <Text style={styles.pageTitle}>Stuur direct een bericht</Text>
            <Text style={styles.pageLead}>We reageren snel. Gebruik wat voor jou het makkelijkst is.</Text>

            <View style={[styles.productWrap, isWide && styles.productWrapWide]}>
              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Contactformulier</Text>
                <TextInput
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="Naam"
                  placeholderTextColor="#7b8ca8"
                  style={styles.input}
                />
                <TextInput
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  placeholder="E-mail"
                  placeholderTextColor="#7b8ca8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  value={contactMessage}
                  onChangeText={setContactMessage}
                  placeholder="Bericht"
                  placeholderTextColor="#7b8ca8"
                  multiline
                  style={[styles.input, styles.textArea]}
                />
                <Pressable style={styles.primaryButton} onPress={sendContact}>
                  <Text style={styles.primaryButtonText}>Verstuur bericht</Text>
                </Pressable>
              </View>

              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Directe opties</Text>
                <Text style={styles.bullet}>• E-mail: info@focuskracht.nl</Text>
                <Text style={styles.bullet}>• Reactietijd: meestal binnen 24 uur</Text>
                <Text style={styles.bullet}>• Tip: zet je bestelnummer in je onderwerp</Text>
                <Pressable style={styles.secondaryButton} onPress={openCheckout}>
                  <Text style={styles.secondaryButtonText}>Liever direct bestellen</Text>
                </Pressable>
              </View>
            </View>
          </>
        );

      case "privacy":
        return (
          <>
            <Text style={styles.eyebrow}>Privacy</Text>
            <Text style={styles.pageTitle}>Je gegevens blijven veilig</Text>
            <Text style={styles.pageLead}>
              We vragen alleen data die nodig is voor bestelling, levering en support.
            </Text>

            <View style={styles.pageCard}>
              <Text style={styles.pageCardTitle}>Wat we bewaren</Text>
              <Text style={styles.bullet}>• Naam en e-mail voor levering</Text>
              <Text style={styles.bullet}>• Betaalinfo via je betaalprovider</Text>
              <Text style={styles.bullet}>• Bestelgegevens voor support</Text>

              <Text style={[styles.pageCardTitle, styles.topSpacing]}>Wat we niet doen</Text>
              <Text style={styles.bullet}>• Geen verkoop van data aan derden</Text>
              <Text style={styles.bullet}>• Geen overbodige nieuwsbrieven</Text>
              <Text style={styles.bullet}>• Geen niet-functionele tracking</Text>

              <Text style={styles.smallText}>Vragen: privacy@focuskracht.nl</Text>
            </View>
          </>
        );

      case "checkout":
        return (
          <>
            <Text style={styles.eyebrow}>Checkout</Text>
            <Text style={styles.pageTitle}>Rond je bestelling af in 2 minuten</Text>

            <View style={styles.chipRow}>
              <StepChip text="1 Gegevens" />
              <StepChip text="2 Betalen" />
              <StepChip text="3 Download" />
            </View>

            <View style={[styles.productWrap, isWide && styles.productWrapWide]}>
              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Jouw gegevens</Text>
                <TextInput
                  value={checkoutName}
                  onChangeText={setCheckoutName}
                  placeholder="Naam"
                  placeholderTextColor="#7b8ca8"
                  style={styles.input}
                />
                <TextInput
                  value={checkoutEmail}
                  onChangeText={setCheckoutEmail}
                  placeholder="E-mail"
                  placeholderTextColor="#7b8ca8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <Text style={styles.fieldLabel}>Land</Text>
                <View style={styles.choiceRow}>
                  {COUNTRIES.map((countryOption) => {
                    const active = countryOption === country;
                    return (
                      <Pressable
                        key={countryOption}
                        style={[styles.choiceButton, active && styles.choiceButtonActive]}
                        onPress={() => setCountry(countryOption)}
                      >
                        <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
                          {countryOption}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <TextInput
                  value={coupon}
                  onChangeText={setCoupon}
                  placeholder="Code (optioneel)"
                  placeholderTextColor="#7b8ca8"
                  style={styles.input}
                />

                <Text style={styles.pageCardTitle}>Kies je betaalmethode</Text>
                <View style={styles.stackGap}>
                  {PAYMENT_METHODS.map((method) => {
                    const active = method === paymentMethod;
                    return (
                      <Pressable
                        key={method}
                        style={[styles.methodButton, active && styles.methodButtonActive]}
                        onPress={() => setPaymentMethod(method)}
                      >
                        <Text style={[styles.methodText, active && styles.methodTextActive]}>{method}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable style={styles.primaryButton} onPress={() => completeOrder(false)}>
                  <Text style={styles.primaryButtonText}>Betaal nu met {paymentMethod}</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={() => completeOrder(true)}>
                  <Text style={styles.secondaryButtonText}>Express checkout</Text>
                </Pressable>
              </View>

              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Je bestelling</Text>
                <Text style={styles.bullet}>• Focuskracht ADHD E-book (PDF)</Text>
                <Text style={styles.bullet}>• Bonus: 7 dagen reset-schema</Text>
                <Text style={styles.bullet}>• Bonus: printbare weekplanner</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.pageCardText}>Totaal</Text>
                  <Text style={styles.price}>€19</Text>
                </View>
                <Text style={styles.smallText}>
                  Koppel later je echte Stripe of Mollie checkout voor live betalingen.
                </Text>
              </View>
            </View>
          </>
        );

      case "thanks":
        return (
          <>
            <Text style={styles.eyebrow}>Bedankt</Text>
            <Text style={styles.pageTitle}>Je bestelling is binnen</Text>
            <Text style={styles.pageLead}>{subtitle}</Text>

            <View style={[styles.productWrap, isWide && styles.productWrapWide]}>
              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Directe volgende stap</Text>
                <Text style={styles.pageCardText}>
                  Download je e-book nu en start met de eerste focusoefening van 5 minuten.
                </Text>
                <Pressable style={styles.primaryButton} onPress={openDownload}>
                  <Text style={styles.primaryButtonText}>Download Focuskracht.pdf</Text>
                </Pressable>
                <Text style={styles.smallText}>Vervang de downloadlink in de code met je echte PDF URL.</Text>
              </View>

              <View style={styles.pageCard}>
                <Text style={styles.pageCardTitle}>Besteloverzicht</Text>
                <Text style={styles.bullet}>• Betaalmethode: {thanksMethod}</Text>
                <Text style={styles.bullet}>• Product: Focuskracht ADHD E-book</Text>
                <Text style={styles.bullet}>• Bedrag: €19</Text>
                <Pressable style={styles.secondaryButton} onPress={() => navigate("home")}>
                  <Text style={styles.secondaryButtonText}>Terug naar home</Text>
                </Pressable>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  }
}

function TrustChip({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.trustChip}>
      <Text style={styles.trustIcon}>{icon}</Text>
      <Text style={styles.trustText}>{text}</Text>
    </View>
  );
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <View style={styles.faqCard}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );
}

function StepChip({ text }: { text: string }) {
  return (
    <View style={styles.stepChip}>
      <Text style={styles.stepChipText}>{text}</Text>
    </View>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTop}>
        <View>
          <Text style={styles.footerBrand}>Focuskracht</Text>
          <Text style={styles.footerText}>ADHD-proof e-bookshop met snelle checkout.</Text>
        </View>

        <View>
          <Text style={styles.footerHeading}>Pagina's</Text>
          <Pressable onPress={() => onNavigate("home")}>
            <Text style={styles.footerLink}>Home</Text>
          </Pressable>
          <Pressable onPress={() => onNavigate("about")}>
            <Text style={styles.footerLink}>Over ons</Text>
          </Pressable>
          <Pressable onPress={() => onNavigate("faq")}>
            <Text style={styles.footerLink}>FAQ</Text>
          </Pressable>
          <Pressable onPress={() => onNavigate("contact")}>
            <Text style={styles.footerLink}>Contact</Text>
          </Pressable>
        </View>

        <View>
          <Text style={styles.footerHeading}>Snelle links</Text>
          <Pressable onPress={() => onNavigate("checkout")}>
            <Text style={styles.footerLink}>Bestellen</Text>
          </Pressable>
          <Pressable onPress={() => onNavigate("privacy")}>
            <Text style={styles.footerLink}>Privacy</Text>
          </Pressable>
          <Text style={styles.footerLink}>info@focuskracht.nl</Text>
        </View>
      </View>

      <Text style={styles.footerBottom}>© {new Date().getFullYear()} Focuskracht</Text>
    </View>
  );
}

const fontRegular = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif",
  default: "system-ui",
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbff",
  },
  header: {
    minHeight: 72,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#d8e5f5",
    backgroundColor: "rgba(245, 251, 255, 0.96)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#17b8a6",
    borderWidth: 2,
    borderColor: "#2e90ff",
  },
  brandText: {
    fontFamily: fontRegular,
    fontWeight: "800",
    color: "#11233f",
    fontSize: 20,
    letterSpacing: -0.4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  menuLine: {
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#11233f",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  pageWrap: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 18,
  },
  sectionNarrow: {
    alignSelf: "stretch",
  },
  sectionWide: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1120,
  },
  eyebrow: {
    fontFamily: fontRegular,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#2e90ff",
    fontSize: 12,
  },
  heroWrap: {
    gap: 14,
  },
  heroWrapWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroCopy: {
    flex: 1.1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 18,
    gap: 14,
    shadowColor: "#0f2f52",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  heroCard: {
    flex: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 18,
    gap: 10,
    justifyContent: "space-between",
    shadowColor: "#0f2f52",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  heroTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontWeight: "800",
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -0.8,
  },
  heroText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 16,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#ff6d42",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: fontRegular,
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: -0.2,
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8e5f5",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontWeight: "700",
    fontSize: 14,
  },
  trustGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trustChip: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: "#eef5ff",
    borderWidth: 1,
    borderColor: "#d8e5f5",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustIcon: {
    fontSize: 14,
  },
  trustText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 12,
    fontWeight: "700",
  },
  pill: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    backgroundColor: "#ffe1d7",
    color: "#d1461f",
    textAlignVertical: "center",
    fontFamily: fontRegular,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontWeight: "800",
    fontSize: 30,
    letterSpacing: -0.8,
  },
  cardText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 15,
    lineHeight: 22,
  },
  cardGrid: {
    gap: 12,
  },
  cardGridWide: {
    flexDirection: "row",
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 16,
    gap: 8,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  infoText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 14,
    lineHeight: 21,
  },
  productWrap: {
    gap: 12,
  },
  productWrapWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productCard: {
    flex: 1.1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 18,
    gap: 12,
  },
  productTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  productText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 15,
    lineHeight: 23,
  },
  bulletList: {
    gap: 6,
  },
  bullet: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 14,
    lineHeight: 21,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  price: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  inlineCta: {
    fontFamily: fontRegular,
    color: "#ff6d42",
    fontSize: 15,
    fontWeight: "800",
  },
  stepsCard: {
    flex: 0.9,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 18,
    gap: 10,
  },
  stepsTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  step: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 14,
    lineHeight: 20,
  },
  testimonialRow: {
    gap: 10,
  },
  testimonialRowWide: {
    flexDirection: "row",
  },
  quoteCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 14,
  },
  quote: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 14,
    lineHeight: 21,
  },
  banner: {
    backgroundColor: "#eef7ff",
    borderWidth: 1,
    borderColor: "#d8e5f5",
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  bannerTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  pageTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  pageLead: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 16,
    lineHeight: 24,
  },
  pageCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 18,
    gap: 10,
  },
  pageCardTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  pageCardText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 15,
    lineHeight: 22,
  },
  stackGap: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    padding: 14,
    gap: 8,
  },
  faqQuestion: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 16,
    fontWeight: "800",
  },
  faqAnswer: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#fcfeff",
    paddingHorizontal: 12,
    color: "#11233f",
    fontFamily: fontRegular,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  smallText: {
    fontFamily: fontRegular,
    color: "#58708f",
    fontSize: 13,
    lineHeight: 19,
  },
  topSpacing: {
    marginTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stepChip: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  stepChipText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 12,
    fontWeight: "700",
  },
  fieldLabel: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 14,
    fontWeight: "700",
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  choiceButton: {
    minHeight: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  choiceButtonActive: {
    borderColor: "#17b8a6",
    backgroundColor: "#e7f9f7",
  },
  choiceText: {
    fontFamily: fontRegular,
    color: "#395373",
    fontSize: 13,
    fontWeight: "700",
  },
  choiceTextActive: {
    color: "#137d74",
  },
  methodButton: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#fcfeff",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  methodButtonActive: {
    borderColor: "#17b8a6",
    backgroundColor: "#e7f9f7",
  },
  methodText: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 15,
    fontWeight: "700",
  },
  methodTextActive: {
    color: "#137d74",
  },
  footer: {
    marginTop: 22,
    backgroundColor: "#11233f",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 26,
    gap: 14,
  },
  footerTop: {
    gap: 18,
  },
  footerBrand: {
    fontFamily: fontRegular,
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 18,
  },
  footerText: {
    fontFamily: fontRegular,
    color: "#c6d9f1",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  footerHeading: {
    fontFamily: fontRegular,
    color: "#ffffff",
    fontWeight: "800",
    marginBottom: 6,
    fontSize: 14,
  },
  footerLink: {
    fontFamily: fontRegular,
    color: "#c6d9f1",
    marginBottom: 5,
    fontSize: 13,
  },
  footerBottom: {
    fontFamily: fontRegular,
    color: "#9fb8d9",
    borderTopWidth: 1,
    borderTopColor: "#243c5f",
    paddingTop: 12,
    fontSize: 12,
  },
  floatingBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "rgba(255,255,255,0.98)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  floatingTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontSize: 14,
    fontWeight: "800",
  },
  menuLayer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 88,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 24, 43, 0.45)",
  },
  menuSheet: {
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8e5f5",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 8,
  },
  menuTitle: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 4,
  },
  menuItem: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#f7fbff",
    borderWidth: 1,
    borderColor: "#d8e5f5",
  },
  menuItemActive: {
    borderColor: "#2e90ff",
    backgroundColor: "#eaf3ff",
  },
  menuItemText: {
    fontFamily: fontRegular,
    color: "#11233f",
    fontWeight: "700",
    fontSize: 14,
  },
  menuItemTextActive: {
    color: "#205ea9",
  },
});
