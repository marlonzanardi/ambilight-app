import React from 'react';
import {View, StyleSheet} from 'react-native';
import {List} from 'react-native-paper';

const ProfileScreen = () => {
  const [expanded, setExpanded] = React.useState(true);

  const [] = React.useState(true);
  const [] = React.useState(true);
  return (
    <View style={styles.container}>
      <List.Section title="Detalhes">
        <List.Accordion
          title="Status"
          left={props => <List.Icon {...props} icon="star" />}>
          <List.Item
            title="Status conexão"
            description="Conexão Ativa"
            left={props => <List.Icon {...props} icon="bluetooth" />}
          />
          <List.Item
            title="Nome conexão"
            description="Power Vending"
            left={props => <List.Icon {...props} />}
          />
        </List.Accordion>

        {/* <List.Accordion
          title="Modalidade"
          left={props => <List.Icon {...props} icon="menu" />}
          expanded={expanded}
          onPress={handlePress}>
          <TouchableRipple onPress={() => setCheckedAmblight(!checkedAmblight)}>
            <View style={styles.row}>
              <Subheading>Modalidade Ambilight</Subheading>
              <View pointerEvents="none">
                <Checkbox
                  color={Colors.blue500}
                  status={checkedAmblight ? 'checked' : 'unchecked'}
                />
              </View>
            </View>
          </TouchableRipple>
          <List.Accordion
            title="Modalidade RGB"
            left={props => <List.Icon {...props} />}>
            <TouchableRipple onPress={() => setCheckedRGB(!checkedRGB)}>
              <View style={styles.row}>
                <Subheading>Ativar</Subheading>
                <View pointerEvents="none">
                  <Checkbox
                    color={Colors.blue500}
                    status={checkedRGB ? 'checked' : 'unchecked'}
                  />
                </View>
              </View>
            </TouchableRipple>
            <View style={{height: '50%', padding: 10}}>
              <ColorPicker
                onColorSelected={color => alert(`Color selected: ${color}`)}
                style={{flex: 1}}
              />
            </View>
          </List.Accordion>
        </List.Accordion> */}

        {/* <List.Accordion
          title="Configurações"
          left={props => <List.Icon {...props} icon="tools" />}
          expanded={expanded}
          onPress={handlePress}>
          <List.Item title="First item" />
          <List.Item title="Second item" />
        </List.Accordion> */}
      </List.Section>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {},
});
